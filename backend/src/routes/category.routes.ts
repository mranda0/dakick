import { Router } from "express"
import { getCategories, createCategory, deleteCategory } from "../controllers/category.controller"
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware"

const router = Router()

router.get("/", getCategories)
router.post("/", authenticate, authorizeAdmin, createCategory)
router.delete("/:id", authenticate, authorizeAdmin, deleteCategory)

export default router