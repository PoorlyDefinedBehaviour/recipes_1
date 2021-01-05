import { Either } from "fp-ts/lib/Either"
import { Failure } from "../contracts/failure"
import Recipe from "../entities/recipe"

export interface RecipeRepository {
  findRecipesByKeywords: (
    keywords: string[]
  ) => Promise<Either<Failure, Recipe[]>>
}
