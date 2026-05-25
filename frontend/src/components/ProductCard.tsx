import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  imageUrl: string | null
  category: { name: string }
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3 relative">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Sin imagen
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
        <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-900 font-bold mt-1">${product.price}</p>
      </div>
    </Link>
  )
}