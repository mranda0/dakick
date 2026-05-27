import { Router } from "express"
import { createPaymentIntent, handleWebhook } from "../controllers/payment.controller"
import { authenticate } from "../middlewares/auth.middleware"
import express from "express"

const router = Router()

// Webhook necesita el body sin parsear
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook)
router.post("/create-payment-intent", authenticate, createPaymentIntent)

export default router