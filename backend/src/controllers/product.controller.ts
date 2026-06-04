import { Request, Response } from "express"
import { prisma } from "../utils/prisma"

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, page = "1", limit = "12" } = req.query

    const where: any = { isActive: true }

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.name = { contains: String(search), mode: "insensitive" }
    }

    const skip = (Number(page) - 1) * Number(limit)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, sizes: true },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ])

    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params as { slug: string }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, sizes: true },
    })

    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" })
      return
    }

    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, stock, categoryId, sizes } = req.body

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        imageUrl,
        stock,
        categoryId,
        sizes: {
          create: sizes || [],
        },
      },
      include: { category: true, sizes: true },
    })

    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }
    const { name, description, price, imageUrl, stock, categoryId, isActive } = req.body

    const data: any = { description, price, imageUrl, stock, categoryId, isActive }

    if (name) {
      data.name = name
      data.slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true, sizes: true },
    })

    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })

    res.json({ message: "Producto eliminado" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}