import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(__dirname, "../.env") })

import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log("🌱 Iniciando seed...")

  // Categorías
  const hombre = await prisma.category.upsert({
    where: { slug: "hombre" },
    update: {},
    create: { name: "Hombre", slug: "hombre" },
  })

  const mujer = await prisma.category.upsert({
    where: { slug: "mujer" },
    update: {},
    create: { name: "Mujer", slug: "mujer" },
  })

  console.log("✅ Categorías creadas")

  // Función para generar slug
  const makeSlug = (name: string, code: string) =>
    `${name}-${code}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")

  // Función para parsear tallas
  const parseSizes = (tallasStr: string): string[] => {
    return tallasStr
      .split(/[-,]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
  }

  // Productos Hombre
  const productosHombre = [
    { marca: "Adidas", codigo: "ID6320",     nombre: "QUESTAR 3",                          tallas: "43.33 - 41.33",   precio: 239 },
    { marca: "Adidas", codigo: "JS3807",     nombre: "GRAND COURT ALPHA 00s Negro-Dorado", tallas: "41.33 - 42.67",   precio: 239 },
    { marca: "Adidas", codigo: "ID3712",     nombre: "VL COURT BASE",                      tallas: "42.67 - 42",   precio: 199 },
    { marca: "Adidas", codigo: "JR0542",     nombre: "GRAND COURT ALPHA 00s Negro-Blanco", tallas: "43.33",        precio: 229 },
    { marca: "Adidas", codigo: "ID6285",     nombre: "VL COURT 3.0",                       tallas: "42.67 - 42 - 44",   precio: 205 },
    { marca: "Nike",   codigo: "DH2987-100", nombre: "COURT VISION LO NN",                 tallas: "42.5 - 43", precio: 239 },
    { marca: "Nike",   codigo: "HJ9094-012", nombre: "AIR FORCE 1 07 LV8 Gris-Rojo",       tallas: "42",        precio: 449 },
    { marca: "Nike",   codigo: "DV0787-100", nombre: "AIR FORCE 1 07 LV8 EMB Blanco-Celeste", tallas: "42.5",  precio: 429 },
    { marca: "Nike",   codigo: "FJ4146-001", nombre: "AIR FORCE 1 07 Negro-Verde",         tallas: "42.5",      precio: 449 },
    { marca: "Nike",   codigo: "DD1391-100", nombre: "DUNK LOW RETRO Negro-Blanco",        tallas: "42",        precio: 459 },
    { marca: "Nike",   codigo: "DV0833-111", nombre: "DUNK LOW RETRO Verde-Blanco",        tallas: "42.5",      precio: 449 },
    { marca: "Nike",   codigo: "DV0833-106", nombre: "DUNK LOW RETRO Celeste-Blanco",      tallas: "42.5",      precio: 449 },
    { marca: "Nike",   codigo: "FD6454-001", nombre: "DOWNSHIFTER 13",                     tallas: "42 - 42.5- 43 - 44", precio: 209 },
  ]

  // Productos Mujer
  const productosMujer = [
    { marca: "Adidas", codigo: "JI3455",    nombre: "HOOPS 3.0 BOLD W Azul",      tallas: "36 - 38.67",   precio: 209 },
    { marca: "Adidas", codigo: "ID8797",    nombre: "VL COURT 3.0 Mujer",         tallas: "36 - 36.67 - 37.33",   precio: 205 },
    { marca: "Adidas", codigo: "JQ2998",    nombre: "GRAND COURT ALPHA 00s Mujer",tallas: "36 - 36.67",         precio: 229 },
    { marca: "Adidas", codigo: "IH4777",    nombre: "VL COURT BOLD J",            tallas: "36.67 - 37.33",   precio: 209 },
    { marca: "Nike",   codigo: "DZ5394-102",nombre: "COURT VISION ALTA Mujer",    tallas: "36.5",       precio: 300 },
    { marca: "Adidas", codigo: "JI3469",    nombre: "HOOPS 3.0 BOLD J Morado",    tallas: "36 - 37.33",   precio: 199 },
    { marca: "Adidas", codigo: "JQ2263",    nombre: "COURTBLOCK BOLD",            tallas: "36 - 37.33",   precio: 209 },
    { marca: "Adidas", codigo: "IH6101",    nombre: "RESPONSE RUNNER U",          tallas: "37.33 - 38.67",   precio: 139 },
  ]

  // Insertar productos hombre
  for (const p of productosHombre) {
    const slug = makeSlug(p.nombre, p.codigo)
    const sizes = parseSizes(p.tallas)

    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: `${p.marca} ${p.nombre}`,
        slug,
        description: `${p.marca} ${p.nombre} — Código: ${p.codigo}`,
        price: p.precio,
        stock: sizes.length,
        categoryId: hombre.id,
        isActive: true,
        sizes: {
          create: sizes.map((size) => ({ size, stock: 1 })),
        },
      },
    })
    console.log(`✅ ${p.marca} ${p.nombre}`)
  }

  // Insertar productos mujer
  for (const p of productosMujer) {
    const slug = makeSlug(p.nombre, p.codigo)
    const sizes = parseSizes(p.tallas)

    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: `${p.marca} ${p.nombre}`,
        slug,
        description: `${p.marca} ${p.nombre} — Código: ${p.codigo}`,
        price: p.precio,
        stock: sizes.length,
        categoryId: mujer.id,
        isActive: true,
        sizes: {
          create: sizes.map((size) => ({ size, stock: 1 })),
        },
      },
    })
    console.log(`✅ ${p.marca} ${p.nombre}`)
  }

  console.log("🎉 Seed completado — todos los productos cargados")
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })