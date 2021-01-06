import { Either, fold, isLeft, left, right } from "fp-ts/Either"
import mem from "mem"
import * as R from "ramda"
import Recipe from "../entities/recipe"
import { Failure } from "../contracts/failure"
import { GifRepository } from "../repositories/gif_repository"
import Gif from "../entities/gif"
import { unreachable } from "../../utils"
import { RecipeRepository } from "../repositories/recipe_repository"

type Dependencies = {
  recipeRepository: RecipeRepository
  gifRepository: GifRepository
}

type RecipeWithGif = Recipe & {
  gif: string
}

const addGifToEachRecipe = (recipes: Recipe[], gifs: Gif[]): RecipeWithGif[] =>
  R.zip(recipes, gifs).map(([recipe, gif]) => ({
    ...recipe,
    gif: gif.url,
  }))

const findGifsForRecipes = async (
  gifRepository: GifRepository,
  recipes: Recipe[]
): Promise<Either<Error, Gif[]>> => {
  const gifs = await Promise.all(
    recipes.map(recipe => gifRepository.findGifByText(recipe.title))
  )

  if (gifs.some(isLeft)) {
    return left(new Error("couldn't get gifs for all recipes"))
  }

  return right(
    gifs.map(
      fold(
        _error => unreachable(),
        x => x
      )
    )
  )
}

export default ({ recipeRepository, gifRepository }: Dependencies) => {
  const findRecipes = async (
    keywords: string[]
  ): Promise<Either<Failure, RecipeWithGif[]>> => {
    const recipes = await recipeRepository.findRecipesByKeywords(keywords)
    if (isLeft(recipes)) {
      return left({ message: "couldn't fetch recipes, try again later" })
    }

    const gifs = await findGifsForRecipes(gifRepository, recipes.right)
    if (isLeft(gifs)) {
      return left({ message: "couldn't fetch gifs, try again later" })
    }

    return right(addGifToEachRecipe(recipes.right, gifs.right))
  }

  const FIVE_SECONDS = 5000

  return mem(findRecipes, {
    maxAge: FIVE_SECONDS,
    cacheKey: ([keywords]) => keywords.join(","),
  })
}
