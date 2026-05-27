import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import productRoutes from "./routes/product.routes"
import categoryRoutes from "./routes/category.routes"
import paymentRoutes from "./routes/payment.routes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000


   
// Middlewares de seguridad
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Rutas
app.use('/api/auth', authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/payments", paymentRoutes)

// Ruta de prueba
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dakick API corriendo 🚀' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

export default app