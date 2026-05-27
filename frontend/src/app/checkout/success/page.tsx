"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cart.store"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [])

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-gray-900 mb-2">¡Pago exitoso!</h1>
        <p className="text-gray-500 mb-8">
          Tu pedido fue confirmado. Te enviaremos los detalles por email.
        </p>
        <Link
          href="/products"
          className="bg-black text-white px-8 py-4 font-black text-sm tracking-wide hover:bg-gray-900 transition-colors inline-block rounded-xl"
        >
          SEGUIR COMPRANDO
        </Link>
      </div>
    </main>
  )
}