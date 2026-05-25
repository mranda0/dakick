import { Router } from "express"
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller"
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware"

const router = Router()

router.get("/", getProducts)
router.get("/:slug", getProduct)
router.post("/", authenticate, authorizeAdmin, createProduct)
router.put("/:id", authenticate, authorizeAdmin, updateProduct)
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct)

export default router