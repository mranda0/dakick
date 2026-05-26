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
  const images: { slug: string; imageUrl: string }[] = [
    // HOMBRE
    { slug: "questar-3-id6320",                                  imageUrl: "/fotos/Questar/questar1.jpg" },
    { slug: "grand-court-alpha-00s-negro-dorado-js3807",         imageUrl: "/fotos/Grand Court Alpha 00s/grand-court-alpha-verdeagua1.jpg" },
    { slug: "vl-court-base-id3712",                              imageUrl: "/fotos/VL Court Base/vl-court-base1.jpg" },
    { slug: "grand-court-alpha-00s-negro-blanco-jr0542",         imageUrl: "/fotos/Grand Court Alpha Gris/grand-court-gris1.jpg" },
    { slug: "vl-court-30-id6285",                                imageUrl: "/fotos/VL Court 3/vl-court-31.jpg" },
    { slug: "court-vision-lo-nn-dh2987-100",                     imageUrl: "/fotos/Court Vision Low NN/court-vision-low-nn1.jpg" },
    { slug: "air-force-1-07-lv8-gris-rojo-hj9094-012",          imageUrl: "/fotos/Air Force 1 Gris-Rojo/air-force-1-grisrojo1.jpg" },
    { slug: "air-force-1-07-lv8-emb-blanco-celeste-dv0787-100", imageUrl: "/fotos/Air Force 1 LV8/air-force-1-lv81.jpg" },
    { slug: "air-force-1-07-blanco-cw2288-111",                  imageUrl: "/fotos/Air Force 1 '07 Negro-Verde/air-force-1-negroverde1.jpg" },
    { slug: "air-force-1-07-negro-verde-fj4146-001",             imageUrl: "/fotos/Air Force 1 '07 Negro-Verde/air-force-1-negroverde1.jpg" },
    { slug: "dunk-low-retro-negro-blanco-dd1391-100",            imageUrl: "/fotos/Dunk Low Retro Negro-Blanco/dunk-low-retro-negroblanco1.jpg" },
    { slug: "dunk-low-retro-verde-blanco-dv0833-111",            imageUrl: "/fotos/Dunk Low Retro Verde/dunk-low-retro-verde1.jpg" },
    { slug: "dunk-low-retro-celeste-blanco-dv0833-106",          imageUrl: "/fotos/Dunk Low Retro Celeste/dunk-low-retro-celeste1.jpg" },
    { slug: "downshifter-13-fd6454-001",                         imageUrl: "/fotos/Downshifter 13/downshifter1.jpg" },
    // MUJER
    { slug: "hoops-30-bold-w-azul-ji3455",                       imageUrl: "/fotos/Hoops 3.0 Bold Azul/hoops3-bold1.jpg" },
    { slug: "vl-court-30-mujer-id8797",                          imageUrl: "/fotos/VL Court Bold/vl-court-bold1.jpg" },
    { slug: "grand-court-alpha-00s-mujer-jq2998",                imageUrl: "/fotos/Grand Court Alpha 00s/grand-court-alpha-verdeagua1.jpg" },
    { slug: "vl-court-bold-j-ih4777",                            imageUrl: "/fotos/VL Court Bold/vl-court-bold1.jpg" },
    { slug: "court-vision-alta-mujer-dz5394-102",                imageUrl: "/fotos/Court Vision Alta/court-vision-alta1.jpg" },
    { slug: "hoops-30-bold-j-morado-ji3469",                     imageUrl: "/fotos/Hoops 3.0 Bold Morado/hoops3-morado1.jpg" },
    { slug: "courtblock-bold-jq2263",                            imageUrl: "/fotos/Courtblock Bold/courtblock1.jpg" },
    { slug: "switch-run-w-if9333",                               imageUrl: "/fotos/Response Runner/response-runner1.png" },
    { slug: "response-runner-u-ih6101",                          imageUrl: "/fotos/Response Runner/response-runner1.png" },
  ]

  for (const item of images) {
    try {
      await prisma.product.update({
        where: { slug: item.slug },
        data: { imageUrl: item.imageUrl },
      })
      console.log(`✅ ${item.slug}`)
    } catch (e) {
      console.log(`❌ No encontrado: ${item.slug}`)
    }
  }

  console.log("🎉 Imágenes actualizadas")
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })