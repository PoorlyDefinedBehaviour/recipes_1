import express from "express"
import cors from "cors"
import recipeRouter from "./routes/v1/recipes"
import { env } from "../../config/env"

export const app = express().use(express.json()).use(cors()).use(recipeRouter)

export const startServer = () =>
  new Promise<void>(resolve => app.listen(env.PORT, resolve))
