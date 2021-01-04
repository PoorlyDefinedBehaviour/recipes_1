import { Either } from "fp-ts/Either"
import mem from "mem"
import { Recipe } from "../entities/recipe"
import { Failure } from "../contracts/failure"

type RecipeRepository = {
  findRecipesByKeywords: (
    keywords: string[]
  ) => Promise<Either<Failure, Recipe[]>>
}

type Dependencies = {
  recipeRepository: RecipeRepository
}

const findRecipes = async (
  { recipeRepository }: Dependencies,
  keywords: string[]
): Promise<Either<Failure, Recipe[]>> =>
  recipeRepository.findRecipesByKeywords(keywords)

const TEN_SECONDS = 10000
export default mem(findRecipes, {
  maxAge: TEN_SECONDS,
  cacheKey: ([_deps, keywords]) => keywords.join(","),
})
