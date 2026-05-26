"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import ProductCard from "@/components/ProductCard"
import api from "@/lib/axios"
import { useSearchParams } from "next/navigation"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  imageUrl: string | null
  category: { name: string }
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
  const [activeCategory, setActiveCategory] = useState(category || "")

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params: any = {}
    if (activeCategory) params.category = activeCategory
    if (search) params.search = search

    api.get("/products", { params })
      .then((res) => setProducts(res.data.products))
      .finally(() => setLoading(false))
  }, [activeCategory, search])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              {search ? `Resultados: "${search}"` : "Todos los productos"}
            </h1>
            <p className="text-gray-500">{products.length} productos encontrados</p>
          </div>

          {/* Filtros por categoría */}
          <div className="flex gap-3 mb-10 flex-wrap">
            <button
              onClick={() => setActiveCategory("")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === ""
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid de productos */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded-xl mb-3" />
                  <div className="h-3 bg-gray-100 rounded mb-2 w-1/2" />
                  <div className="h-4 bg-gray-100 rounded mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-2xl font-bold mb-2">Sin productos</p>
              <p className="text-sm">Intenta con otro filtro</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  )
}