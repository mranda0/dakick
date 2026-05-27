"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import Navbar from "@/components/Navbar"
import { useCartStore } from "@/store/cart.store"
import { useAuthStore } from "@/store/auth.store"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import Link from "next/link"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const clearCart = useCartStore((s) => s.clearCart)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError("")

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
      },
    })

    if (stripeError) {
      setError(stripeError.message || "Error al procesar el pago")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-black text-white py-4 font-black text-sm tracking-wide hover:bg-gray-900 transition-colors disabled:opacity-50 rounded-xl"
      >
        {loading ? "Procesando..." : "PAGAR AHORA"}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { items, total } = useCartStore()
  const { user } = useAuthStore()
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState("")
  const [orderId, setOrderId] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (items.length === 0) {
      router.push("/cart")
      return
    }

    api.post("/payments/create-payment-intent", { items })
      .then((res) => {
        setClientSecret(res.data.clientSecret)
        setOrderId(res.data.orderId)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Preparando tu pago...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-black text-gray-900 mb-10">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Formulario de pago */}
            <div>
              <h2 className="font-black text-gray-900 mb-6">Datos de pago</h2>
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#000000",
                        borderRadius: "12px",
                      },
                    },
                  }}
                >
                  <CheckoutForm orderId={orderId} />
                </Elements>
              )}
            </div>

            {/* Resumen del pedido */}
            <div>
              <h2 className="font-black text-gray-900 mb-6">Resumen del pedido</h2>
              <div className="border border-gray-100 rounded-2xl p-6 space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Talla: {item.size} · x{item.quantity}</p>
                      <p className="text-sm font-black text-gray-900 mt-1">S/ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>S/ {total().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                  <div className="flex justify-between font-black text-gray-900 text-lg">
                    <span>Total</span>
                    <span>S/ {total().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link href="/cart" className="text-sm text-gray-500 hover:text-black mt-4 block transition-colors">
                ← Volver al carrito
              </Link>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}