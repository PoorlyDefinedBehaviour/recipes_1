import { Request, Response } from "express"
import { fold } from "fp-ts/lib/Either"
import StatusCodes from "http-status-codes"
import makeFindRecipes from "../../../domain/usecases/find_recipes"
import * as giphyRepository from "../../../infra/repositories/giphy_repository"
import * as puppyRecipeRepository from "../../../infra/repositories/recipe_puppy_repository"

const findRecipes = makeFindRecipes({
  gifRepository: giphyRepository,
  recipeRepository: puppyRecipeRepository,
})

export const search = (request: Request, response: Response) => {
  const keywords = request.query.i
    ? (request.query.i as string).replace(/ /g, "").split(",")
    : []

  return findRecipes(keywords).then(
    fold(
      failure =>
        response
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: failure.message }),
      recipes => response.json({ keywords, recipes })
    )
  )
}
