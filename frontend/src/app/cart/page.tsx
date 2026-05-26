"use client"

import Navbar from "@/components/Navbar"
import { useCartStore } from "@/store/cart.store"
import { Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count } = useCartStore()

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white pt-24 flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">👟</p>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8">Agrega algunos productos para continuar</p>
            <Link
              href="/products"
              className="bg-black text-white px-8 py-4 font-black text-sm tracking-wide hover:bg-gray-900 transition-colors inline-block"
            >
              VER PRODUCTOS
            </Link>
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
          <h1 className="text-3xl font-black text-gray-900 mb-2">Tu carrito</h1>
          <p className="text-gray-500 mb-10">{count()} {count() === 1 ? "producto" : "productos"}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 border border-gray-100 rounded-2xl">
                  <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">Talla: {item.size}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="border border-gray-100 rounded-2xl p-6 sticky top-24">
                <h2 className="font-black text-gray-900 mb-6">Resumen</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>S/ {total().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900">
                    <span>Total</span>
                    <span>S/ {total().toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="w-full bg-black text-white py-4 font-black text-sm tracking-wide hover:bg-gray-900 transition-colors flex items-center justify-center rounded-xl"
                >
                  PROCEDER AL PAGO
                </Link>
                <Link
                  href="/products"
                  className="w-full text-center text-sm text-gray-500 hover:text-black mt-3 block transition-colors"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  )
}