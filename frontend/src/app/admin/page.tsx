"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import api from "@/lib/axios"
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react"

interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  revenue: number
}

export default function AdminPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/")
      return
    }
    api.get("/admin/stats").then((res) => setStats(res.data))
  }, [user])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">

          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900">Panel de administración</h1>
            <p className="text-gray-500 mt-1">Bienvenido, {user?.name}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Productos", value: stats?.totalProducts ?? "—", icon: Package, color: "bg-blue-50 text-blue-600" },
              { label: "Pedidos", value: stats?.totalOrders ?? "—", icon: ShoppingBag, color: "bg-yellow-50 text-yellow-600" },
              { label: "Usuarios", value: stats?.totalUsers ?? "—", icon: Users, color: "bg-green-50 text-green-600" },
              { label: "Ingresos", value: stats ? `S/ ${stats.revenue.toFixed(2)}` : "—", icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Accesos rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Gestionar productos", description: "Agregar, editar y eliminar productos", href: "/admin/products", color: "bg-black text-white" },
              { title: "Ver pedidos", description: "Revisar y actualizar estado de pedidos", href: "/admin/orders", color: "bg-white text-black border border-gray-200" },
              { title: "Categorías", description: "Administrar categorías de productos", href: "/admin/categories", color: "bg-white text-black border border-gray-200" },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={`${card.color} rounded-2xl p-6 hover:opacity-90 transition-opacity`}
              >
                <h3 className="font-black text-lg mb-2">{card.title}</h3>
                <p className={`text-sm ${card.color.includes("black text-white") ? "text-gray-300" : "text-gray-500"}`}>
                  {card.description}
                </p>
              </Link>
            ))}
          </div>

        </div>
      </main>
    </>
  )
}