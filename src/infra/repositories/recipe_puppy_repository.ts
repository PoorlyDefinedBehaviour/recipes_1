import { Either, left, right } from "fp-ts/lib/Either"
import { env } from "../../config/env"
import Recipe from "../../domain/entities/recipe"
import * as http from "../http"

interface RecipePuppyResponse {
  title: string
  version: number
  href: string
  results: {
    title: string
    href: string
    ingredients: string
    thumbnail: string
  }[]
}

const sortAlphabetically = (array: string[]): string[] =>
  array.slice().sort((a, b) => a.localeCompare(b))

const toArray = (value: string): string[] => value.replace(/ /g, "").split(",")

export const findRecipesByKeywords = async (
  keywords: string[],
  options?: { page?: number; query?: string }
): Promise<Either<Error, Recipe[]>> => {
  try {
    const { results } = await http.get<RecipePuppyResponse>(
      env.RECIPE_API_URL,
      {
        query: { i: keywords.join(","), p: options?.page, q: options?.query },
        retries: 3,
      }
    )

    const recipes = results.map(result => ({
      title: result.title,
      ingredients: sortAlphabetically(toArray(result.ingredients)),
      link: result.href,
    }))

    return right(recipes)
  } catch (error) {
    return left(error)
  }
}
