import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { prisma } from "../utils/prisma"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt"

export const register = async (req: Request, res: Response) => {
  try {
    console.log("Body recibido:", req.body)
    
    const { name, email, password } = req.body

    console.log("Buscando usuario...")
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(400).json({ message: "El email ya está registrado" })
      return
    }

    console.log("Hasheando password...")
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log("Creando usuario...")
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true }
    })

    res.status(201).json({ message: "Usuario creado", user })
  } catch (error) {
    console.error("ERROR COMPLETO:", error)
    res.status(500).json({ message: "Error interno del servidor", detail: String(error) })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ message: "Credenciales inválidas" })
      return
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      res.status(401).json({ message: "Credenciales inválidas" })
      return
    }

    const accessToken = generateAccessToken(user.id, user.role)
    const refreshToken = generateRefreshToken(user.id)

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch {
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken
    if (!token) {
      res.status(401).json({ message: "Refresh token requerido" })
      return
    }

    const payload = verifyRefreshToken(token)

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user || user.refreshToken !== token) {
      res.status(401).json({ message: "Token inválido" })
      return
    }

    const accessToken = generateAccessToken(user.id, user.role)
    res.json({ accessToken })
  } catch {
    res.status(401).json({ message: "Token inválido o expirado" })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken
    if (token) {
      const payload = verifyRefreshToken(token)
      await prisma.user.update({
        where: { id: payload.userId },
        data: { refreshToken: null }
      })
    }
    res.clearCookie("refreshToken")
    res.json({ message: "Sesión cerrada" })
  } catch {
    res.clearCookie("refreshToken")
    res.json({ message: "Sesión cerrada" })
  }
}