import { Request, Response } from "express"
import { prisma } from "../utils/prisma"

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, imageUrl } = req.body

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const category = await prisma.category.create({
      data: { name, slug, imageUrl },
    })

    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await prisma.category.delete({ where: { id } })
    res.json({ message: "Categoría eliminada" })
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" })
  }
}