import { defineConfig } from "prisma/config"
import * as dotenv from "dotenv"

dotenv.config()

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    adapter: async () => {
      const { Pool, neonConfig } = await import("@neondatabase/serverless")
      const { PrismaNeon } = await import("@prisma/adapter-neon")
      const ws = await import("ws")
      neonConfig.webSocketConstructor = ws.default
      const pool = new Pool({ connectionString: process.env.DATABASE_URL })
      return new PrismaNeon(pool as any)
    },
  },
})