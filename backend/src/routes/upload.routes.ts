import { Router } from "express"
import multer from "multer"
import { uploadImage } from "../controllers/upload.controller"
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware"

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Solo se permiten imágenes"))
    }
  },
})

const router = Router()

router.post("/", authenticate, authorizeAdmin, upload.single("image"), uploadImage)

export default router