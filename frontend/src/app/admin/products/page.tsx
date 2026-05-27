"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import api from "@/lib/axios"
import { Pencil, Trash2, Plus, ChevronLeft } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  isActive: boolean
  imageUrl: string | null
  category: { name: string }
}

export default function AdminProductsPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "ADMIN") { router.push("/"); return }
    fetchProducts()
  }, [user])

  const fetchProducts = async () => {
    setLoading(true)
    const res = await api.get("/products?limit=100")
    setProducts(res.data.products)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return
    await api.delete(`/products/${id}`)
    fetchProducts()
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    await api.put(`/products/${id}`, { isActive: !isActive })
    fetchProducts()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/admin" className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-2 transition-colors">
                <ChevronLeft size={16} /> Panel admin
              </Link>
              <h1 className="text-3xl font-black text-gray-900">Productos</h1>
            </div>
            <Link
              href="/admin/products/new"
              className="bg-black text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-900 transition-colors"
            >
              <Plus size={16} /> Nuevo producto
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Cargando...</div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Producto</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Categoría</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Precio</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Stock</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Estado</th>
                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                            {product.imageUrl && (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-1" />
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.category.name}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">S/ {product.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(product.id, product.isActive)}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            product.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.isActive ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-black"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-500"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  )
}