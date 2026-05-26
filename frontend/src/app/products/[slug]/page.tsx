"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import api from "@/lib/axios"
import { ShoppingBag, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProductSize {
  id: string
  size: string
  stock: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  imageUrl: string | null
  stock: number
  category: { name: string }
  sizes: ProductSize[]
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)

  // Genera las dos imágenes del producto
  const getImages = (imageUrl: string) => {
    const img2 = imageUrl.replace("1.jpg", "2.jpg").replace("1.png", "2.png")
    return [imageUrl, img2]
  }

  useEffect(() => {
    api.get(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-white pt-24 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-gray-100 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-8 bg-gray-100 rounded w-3/4" />
              <div className="h-6 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!product) return null

  const images = product.imageUrl ? getImages(product.imageUrl) : []

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">

          {/* Breadcrumb */}
          <Link href="/products" className="flex items-center gap-1 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
            <ChevronLeft size={16} />
            Volver a productos
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Imágenes */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
                {images[activeImage] && (
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-contain p-8"
                  />
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        "w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors bg-gray-50",
                        activeImage === i ? "border-black" : "border-transparent"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
              <h1 className="text-3xl font-black text-gray-900 mb-4">{product.name}</h1>
              <p className="text-4xl font-black text-gray-900 mb-6">S/ {product.price}</p>

              {product.description && (
                <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
              )}

              {/* Tallas */}
              {product.sizes.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    TALLA {selectedSize && <span className="text-gray-500 font-normal">— {selectedSize} EU</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSize(s.size)}
                        disabled={s.stock === 0}
                        className={cn(
                          "w-14 h-14 rounded-xl text-sm font-medium border-2 transition-colors",
                          s.stock === 0
                            ? "border-gray-100 text-gray-300 cursor-not-allowed"
                            : selectedSize === s.size
                            ? "border-black bg-black text-white"
                            : "border-gray-200 text-gray-900 hover:border-gray-400"
                        )}
                      >
                        {s.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón agregar al carrito */}
              <button
                disabled={product.sizes.length > 0 && !selectedSize}
                className={cn(
                  "w-full py-4 font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-colors",
                  product.sizes.length > 0 && !selectedSize
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-900"
                )}
              >
                <ShoppingBag size={18} />
                {product.sizes.length > 0 && !selectedSize ? "SELECCIONA UNA TALLA" : "AGREGAR AL CARRITO"}
              </button>

              {/* Stock */}
              <p className="text-xs text-gray-400 text-center mt-3">
                {product.stock} unidades disponibles
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}