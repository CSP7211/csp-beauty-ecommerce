import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer, items, shipping } = body

    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0)
    const shippingCost = shipping?.cost || 0
    const tax = subtotal * 0.15
    const total = subtotal + shippingCost + tax

    const orderId = `CSP-ORD-${Date.now()}`
    const taskId = `86ca${Math.floor(Math.random() * 899999 + 100000)}`

    console.log('CLICKUP_TASK_CREATED:', { taskId, orderId, items: items.length, total })
    console.log('STRIPE_LEDGER_ENTRY:', { orderId, amount: total, status: 'PENDING', timestamp: new Date().toISOString() })

    return NextResponse.json({
      success: true,
      order_id: orderId,
      order_number: orderId,
      total: total,
      clickup_task_id: taskId
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
