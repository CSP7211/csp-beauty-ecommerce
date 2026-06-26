import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer, items, shipping, payment_intent_id } = body

    // 1. Create or get customer
    let customerId = customer.id
    if (!customerId) {
      const { data: newCustomer, error: custError } = await supabase
        .from('customers')
        .insert({
          company_name: customer.company_name,
          contact_name: customer.contact_name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          country: customer.country,
          postal_code: customer.postal_code
        })
        .select()
        .single()

      if (custError) throw custError
      customerId = newCustomer.id
    }

    // 2. Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0)
    const shippingCost = shipping.cost || 0
    const tax = subtotal * 0.15
    const total = subtotal + shippingCost + tax

    // 3. Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        status: 'pending',
        subtotal,
        shipping_cost: shippingCost,
        tax_amount: tax,
        total_amount: total,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_country: shipping.country,
        shipping_postal: shipping.postal,
        stripe_payment_intent_id: payment_intent_id,
        gs1_refs: items.map((i: any) => i.gs1)
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 4. Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      sku: item.sku,
      product_name: item.name,
      quantity: item.qty,
      unit_price: item.price,
      unit_cost: item.cost,
      margin_amount: (item.price - item.cost) * item.qty,
      gs1_barcode: item.gs1
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // 5. Trigger ClickUp sync via edge function
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/clickup-sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ record: order, table: 'orders', event: 'INSERT' })
    })

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
      total: total,
      clickup_task_id: order.clickup_task_id
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
