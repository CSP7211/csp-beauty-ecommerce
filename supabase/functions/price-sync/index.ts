import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { sku, new_cost, source, source_url } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    if (!['email', 'pdf', 'api', 'manual'].includes(source)) {
      throw new Error('Invalid source type')
    }

    const wholesale = +(new_cost / 0.75).toFixed(2)
    const margin = 25

    const { data: current } = await supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .single()

    if (!current) throw new Error('Product not found')

    const { data: updated, error } = await supabase
      .from('products')
      .update({
        cost_price: new_cost,
        wholesale_price: wholesale,
        margin_percent: margin,
        updated_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString()
      })
      .eq('sku', sku)
      .select()
      .single()

    if (error) throw error

    await supabase.from('audit_log').insert({
      table_name: 'products',
      record_id: current.id,
      action: 'UPDATE',
      old_data: { cost_price: current.cost_price, wholesale_price: current.wholesale_price },
      new_data: { cost_price: new_cost, wholesale_price: wholesale, source, source_url },
      performed_at: new Date().toISOString()
    })

    if (current.clickup_task_id) {
      await fetch(`https://api.clickup.com/api/v2/task/${current.clickup_task_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': Deno.env.get('CLICKUP_API_KEY')!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: `Price updated from ${source}
New cost: $${new_cost}
New wholesale: $${wholesale}
Source: ${source_url || 'N/A'}`
        })
      })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      sku, 
      old_cost: current.cost_price,
      new_cost,
      wholesale,
      margin,
      source 
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
