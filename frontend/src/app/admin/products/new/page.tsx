"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import api from "@/lib/axios"
import { ChevronLeft, Plus, X } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
}

interface SizeInput {
  size: string
  stock: number
}

export default function NewProductPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [sizes, setSizes] = useState<SizeInput[]>([{ size: "", stock: 1 }])
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    stock: "",
    categoryId: "",
  })

  useEffect(() => {
    if (!user || user.role !== "ADMIN") { router.push("/"); return }
    api.get("/categories").then((res) => setCategories(res.data))
  }, [user])

  const addSize = () => setSizes([...sizes, { size: "", stock: 1 }])

  const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index))

  const updateSize = (index: number, field: keyof SizeInput, value: string | number) => {
    setSizes(sizes.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/products", {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        sizes: sizes.filter((s) => s.size.trim() !== ""),
      })
      router.push("/admin/products")
    } catch (error) {
      alert("Error al crear el producto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">

          <div className="mb-8">
            <Link href="/admin/products" className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-2 transition-colors">
              <ChevronLeft size={16} /> Productos
            </Link>
            <h1 className="text-3xl font-black text-gray-900">Nuevo producto</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors"
                placeholder="Nike Air Max 90"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="Descripción del producto..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors"
                  placeholder="199.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock total</label>
                <input
                  required
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del producto</label>
                <div className="space-y-3">
                    {form.imageUrl && (
                    <div className="w-32 h-32 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <img src={form.imageUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                    </div>
                    )}
                    <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const formData = new FormData()
                        formData.append("image", file)
                        try {
                        const { data } = await api.post("/upload", formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                        })
                        setForm({ ...form, imageUrl: data.url })
                        } catch {
                        alert("Error al subir la imagen")
                        }
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors"
                    />
                    {form.imageUrl && (
                    <p className="text-xs text-green-600">✅ Imagen subida correctamente</p>
                    )}
                </div>
            </div>

            {/* Tallas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Tallas</label>
                <button
                  type="button"
                  onClick={addSize}
                  className="text-xs text-black font-bold flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  <Plus size={14} /> Agregar talla
                </button>
              </div>
              <div className="space-y-2">
                {sizes.map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={s.size}
                      onChange={(e) => updateSize(i, "size", e.target.value)}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors"
                      placeholder="42"
                    />
                    <input
                      type="number"
                      value={s.stock}
                      onChange={(e) => updateSize(i, "stock", parseInt(e.target.value))}
                      className="w-24 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors"
                      placeholder="Stock"
                      min={0}
                    />
                    {sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSize(i)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 font-black text-sm tracking-wide hover:bg-gray-900 transition-colors disabled:opacity-50 rounded-xl"
            >
              {loading ? "Creando..." : "CREAR PRODUCTO"}
            </button>

          </form>
        </div>
      </main>
    </>
  )
}