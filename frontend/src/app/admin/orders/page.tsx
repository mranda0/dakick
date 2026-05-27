"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import api from "@/lib/axios"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  user: { name: string; email: string }
  items: { product: { name: string }; quantity: number; size: string }[]
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-purple-100 text-purple-700",
  CANCELLED: "bg-red-100 text-red-700",
}

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
}

export default function AdminOrdersPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "ADMIN") { router.push("/"); return }
    api.get("/admin/orders").then((res) => setOrders(res.data)).finally(() => setLoading(false))
  }, [user])

  const handleStatusChange = async (id: string, status: string) => {
    await api.put(`/admin/orders/${id}`, { status })
    setOrders(orders.map((o) => o.id === id ? { ...o, status } : o))
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">

          <div className="mb-8">
            <Link href="/admin" className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-2 transition-colors">
              <ChevronLeft size={16} /> Panel admin
            </Link>
            <h1 className="text-3xl font-black text-gray-900">Pedidos</h1>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Cargando...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No hay pedidos aún</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-gray-900">{order.user.name}</p>
                      <p className="text-sm text-gray-500">{order.user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("es-PE", {
                          day: "2-digit", month: "long", year: "numeric"
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-lg">S/ {order.total}</p>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`mt-2 px-3 py-1 rounded-full text-xs font-bold border-0 cursor-pointer ${statusColors[order.status]}`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="border-t border-gray-50 pt-4 space-y-1">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-gray-600">
                        {item.product.name} — Talla {item.size} × {item.quantity}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}