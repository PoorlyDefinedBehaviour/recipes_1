import { Router } from "express"

import * as recipeController from "../../controllers/recipe_controller"
import { withErrorHandler } from "../../utils"

const router = Router()

router.get("/recipes", withErrorHandler(recipeController.search))

export default router
