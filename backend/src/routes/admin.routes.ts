import { Router } from "express"
import { getStats, getOrders, updateOrderStatus } from "../controllers/admin.controller"
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware"

const router = Router()

router.use(authenticate, authorizeAdmin)

router.get("/stats", getStats)
router.get("/orders", getOrders)
router.put("/orders/:id", updateOrderStatus)

export default router