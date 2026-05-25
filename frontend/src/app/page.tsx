import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">

        {/* Hero */}
        <section className="bg-black text-white min-h-screen flex items-center px-4">
          <div className="max-w-7xl mx-auto w-full pt-16">
            <div className="max-w-2xl">
              <p className="text-yellow-400 text-sm font-medium tracking-widest uppercase mb-4">
                Nueva colección 2026
              </p>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6">
                FIND YOUR<br />PERFECT<br />KICK
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-md">
                Las mejores zapatillas del mercado, desde sneakers clásicos hasta los drops más exclusivos.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/products"
                  className="bg-white text-black px-8 py-4 font-bold text-sm tracking-wide hover:bg-gray-100 transition-colors"
                >
                  VER COLECCIÓN
                </Link>
                <Link
                  href="/products?category=zapatillas"
                  className="border border-white text-white px-8 py-4 font-bold text-sm tracking-wide hover:bg-white hover:text-black transition-colors"
                >
                  NOVEDADES
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black mb-12 text-center">CATEGORÍAS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Running", "Basketball", "Lifestyle"].map((cat) => (
                <Link
                  key={cat}
                  href={`/products?search=${cat}`}
                  className="group bg-black text-white rounded-2xl p-8 h-48 flex items-end hover:bg-gray-900 transition-colors"
                >
                  <span className="text-2xl font-black group-hover:translate-x-2 transition-transform">
                    {cat} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 bg-black text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-black mb-4">¿LISTO PARA KICKEAR?</h2>
            <p className="text-gray-400 mb-8">Más de 100 modelos disponibles. Envío gratis en compras mayores a $150.</p>
            <Link
              href="/products"
              className="bg-yellow-400 text-black px-10 py-4 font-black text-sm tracking-wide hover:bg-yellow-300 transition-colors inline-block"
            >
              COMPRAR AHORA
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}