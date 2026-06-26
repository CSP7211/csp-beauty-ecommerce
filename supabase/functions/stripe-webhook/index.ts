import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    const event = JSON.parse(body)

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object

      const { data: order } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString(),
          stripe_charge_id: paymentIntent.charges?.data[0]?.id
        })
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .select()
        .single()

      if (order) {
        await supabase.from('stripe_ledger').insert({
          order_id: order.id,
          stripe_payment_intent_id: paymentIntent.id,
          stripe_charge_id: paymentIntent.charges?.data[0]?.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          status: 'succeeded',
          payment_method: paymentIntent.payment_method_types?.[0],
          card_last4: paymentIntent.charges?.data[0]?.payment_method_details?.card?.last4,
          card_brand: paymentIntent.charges?.data[0]?.payment_method_details?.card?.brand,
          receipt_url: paymentIntent.charges?.data[0]?.receipt_url,
          metadata: paymentIntent.metadata,
          processed_at: new Date().toISOString()
        })

        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/clickup-sync`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` },
          body: JSON.stringify({ record: order, table: 'orders', event: 'UPDATE' })
        })
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
