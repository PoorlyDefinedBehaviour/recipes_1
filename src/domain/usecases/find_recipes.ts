import { Either, fold, isLeft, right } from "fp-ts/Either"
import mem from "mem"
import * as R from "ramda"
import Recipe from "../entities/recipe"
import { Failure } from "../contracts/failure"
import { GifRepository } from "../repositories/gif_repository"
import Gif from "../entities/gif"

type RecipeRepository = {
  findRecipesByKeywords: (
    keywords: string[]
  ) => Promise<Either<Failure, Recipe[]>>
}

type Dependencies = {
  recipeRepository: RecipeRepository
  gifRepository: GifRepository
}

type RecipeWithGif = Recipe & {
  gif: string
}

const addGifToEachRecipe = (
  recipes: Recipe[],
  gifs: Either<Error, Gif>[]
): RecipeWithGif[] => {
  const defaultFoodGifUrl =
    "https://media4.giphy.com/media/3o7btUDtnx3gTwIlmo/giphy.gif"

  const gifUrls = gifs.map(
    fold(
      _error => defaultFoodGifUrl,
      gif => gif.url
    )
  )

  return R.zip(recipes, gifUrls).map(([recipe, url]) => ({
    ...recipe,
    gif: url,
  }))
}

export default ({ recipeRepository, gifRepository }: Dependencies) => {
  const findRecipes = async (
    keywords: string[]
  ): Promise<Either<Failure, RecipeWithGif[]>> => {
    const recipes = await recipeRepository.findRecipesByKeywords(keywords)
    if (isLeft(recipes)) {
      return recipes
    }

    const gifs = await Promise.all(
      recipes.right.map(recipe => gifRepository.findGifByText(recipe.title))
    )

    return right(addGifToEachRecipe(recipes.right, gifs))
  }

  const FIVE_SECONDS = 5000

  return mem(findRecipes, {
    maxAge: FIVE_SECONDS,
    cacheKey: ([keywords]) => keywords.join(","),
  })
}
