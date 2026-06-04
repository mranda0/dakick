import * as dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(__dirname, "../.env") })

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes'
import productRoutes from "./routes/product.routes"
import categoryRoutes from "./routes/category.routes"
import paymentRoutes from "./routes/payment.routes"
import adminRoutes from "./routes/admin.routes"
import uploadRoutes from "./routes/upload.routes"

const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://dakick.vercel.app",
    "https://dakick-6hj13win1-mirandaproject05.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/upload", uploadRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dakick API corriendo 🚀' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

export default app