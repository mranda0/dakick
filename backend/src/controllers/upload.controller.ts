import { Request, Response } from "express"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import path from "path"
import * as dotenv from "dotenv"

dotenv.config({ path: path.resolve(__dirname, "../../.env") })

cloudinary.config({
  cloud_name: "dev8jeyje",
  api_key: "758918861366115",
  api_secret: "MVpwzkpMBMxCdXWPnGRPX_YuXgI",
})

export const uploadImage = async (req: Request, res: Response) => {
  try {

    if (!req.file) {
      res.status(400).json({ message: "No se subió ningún archivo" })
      return
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "dakick/products",
      transformation: [{ width: 800, height: 800, crop: "fill", quality: "auto" }],
    })

    fs.unlinkSync(req.file.path)

    res.json({ url: result.secure_url })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ message: "Error al subir imagen" })
  }
}