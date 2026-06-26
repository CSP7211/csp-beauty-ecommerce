import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CLICKUP_API_KEY = Deno.env.get('CLICKUP_API_KEY')
const CLICKUP_LIST_ID = Deno.env.get('CLICKUP_LIST_ID')

serve(async (req) => {
  const { record, table, event } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    if (table === 'orders' && event === 'INSERT') {
      const clickupResponse = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
        method: 'POST',
        headers: {
          'Authorization': CLICKUP_API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `Order ${record.order_number}`,
          description: `CSP Beauty Order
Customer: ${record.customer_id}
Total: $${record.total_amount}
GS1 Refs: ${record.gs1_refs?.join(', ') || 'N/A'}`,
          status: 'pending',
          priority: 3,
          custom_fields: [
            { id: 'order_number', value: record.order_number },
            { id: 'total_amount', value: record.total_amount },
            { id: 'stripe_intent', value: record.stripe_payment_intent_id || '' }
          ]
        })
      })

      const clickupData = await clickupResponse.json()

      await supabase.from('orders').update({ 
        clickup_task_id: clickupData.id 
      }).eq('id', record.id)

      await supabase.from('clickup_sync_log').insert({
        entity_type: 'order',
        local_id: record.id,
        clickup_task_id: clickupData.id,
        sync_action: 'create',
        sync_status: 'synced'
      })

      return new Response(JSON.stringify({ success: true, clickup_task_id: clickupData.id }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    await supabase.from('clickup_sync_log').insert({
      entity_type: table,
      local_id: record.id,
      sync_action: 'create',
      sync_status: 'failed',
      error_message: error.message
    })

    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
