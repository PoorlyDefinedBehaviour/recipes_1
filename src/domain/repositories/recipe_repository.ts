import { Either } from "fp-ts/lib/Either"
import Recipe from "../entities/recipe"

export interface RecipeRepository {
  findRecipesByKeywords: (
    keywords: string[]
  ) => Promise<Either<Error, Recipe[]>>
}
