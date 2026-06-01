import { Request, Response } from "express"
import Stripe from "stripe"
import { prisma } from "../utils/prisma"
import { AuthRequest } from "../middlewares/auth.middleware"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body
    const userId = req.user?.userId

    if (!items || items.length === 0) {
      res.status(400).json({ message: "No hay items en el carrito" })
      return
    }

    // Calcular total
    const total = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    )

    // Crear orden en la base de datos
    const order = await prisma.order.create({
      data: {
        userId: userId as string,
        total,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
          })),
        },
      },
    })

    // Crear PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe usa centavos
      currency: "pen", // Soles peruanos
      metadata: {
        orderId: order.id,
        userId: userId as string,
      },
    })

    // Guardar stripePaymentId en la orden
    await prisma.order.update({
      where: { id: order.id },
      data: { stripePaymentId: paymentIntent.id },
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    })
  } catch (error) {
    console.error("Payment error:", error)
    res.status(500).json({ message: "Error al procesar el pago" })
  }
}

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

 let event: any

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error("Webhook error:", err)
    res.status(400).json({ message: "Webhook inválido" })
    return
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const orderId = paymentIntent.metadata.orderId

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    })

    await prisma.payment.create({
      data: {
        orderId,
        stripePaymentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: "COMPLETED",
      },
    })
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const orderId = paymentIntent.metadata.orderId

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    })
  }

  res.json({ received: true })
}