"use client"

import Link from "next/link"
import { ShoppingBag, User, Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useCartStore } from "@/store/cart.store"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()
  const count = useCartStore((s) => s.count())

  return (
    <nav className="fixed top-0 w-full z-50 bg-white text-black border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center">
        <img
            src="/fotos/logodakick.png"
            alt="Dakick"
            width={140}
            height={45}
            className="object-contain"
        />
        </Link>

        {/* Links escritorio */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/products" className="hover:text-gray-500 transition-colors">
            Productos
          </Link>
          <Link href="/products?category=zapatillas" className="hover:text-gray-300 transition-colors">
            Zapatillas
          </Link>
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-gray-300 transition-colors text-yellow-400">
              Admin
            </Link>
          )}
        </div>

        {/* Iconos */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-sm text-gray-400">{user.name}</span>
              <button
                onClick={clearAuth} className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link href="/login">
              <User size={20} className="hover:text-gray-300 transition-colors" />
            </Link>
          )}
          <Link href="/cart" className="relative">
            <ShoppingBag size={20} className="hover:text-gray-500 transition-colors" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={cn(
        "md:hidden bg-white border-t border-black/10 overflow-hidden transition-all duration-300",
        open ? "max-h-64 py-4" : "max-h-0"
      )}>
        <div className="flex flex-col gap-4 px-4 text-sm font-medium">
          <Link href="/products" onClick={() => setOpen(false)}>Productos</Link>
          <Link href="/products?category=zapatillas" onClick={() => setOpen(false)}>Zapatillas</Link>
          {user?.role === "ADMIN" && (
            <Link href="/admin" onClick={() => setOpen(false)} className="text-yellow-400">Admin</Link>
          )}
          {!user && <Link href="/login" onClick={() => setOpen(false)}>Iniciar sesión</Link>}
        </div>
      </div>
    </nav>
  )
}