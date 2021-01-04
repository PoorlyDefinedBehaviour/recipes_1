import { left, right } from "fp-ts/Either"
import mem from "mem"
import findRecipes from "./find_recipes"

const mockRecipeRepository = {
  findRecipesByKeywords: jest.fn(),
}

beforeEach(() => jest.clearAllMocks())

describe("find recipes use case test suite", () => {
  test("should fetch recipes from the provided recipe repository", async () => {
    const testCases = [
      { input: ["onion", "tomato"], expected: right([]) },
      { input: [], expected: right([]) },
      { input: ["potato"], expected: right([]) },
      {
        input: ["potato"],
        expected: left({
          message: "It was not possible to fetch recipes, try again later.",
        }),
      },
    ]

    for (const { input, expected } of testCases) {
      mem.clear(findRecipes)

      mockRecipeRepository.findRecipesByKeywords.mockResolvedValueOnce(expected)

      const recipes = await findRecipes(
        {
          recipeRepository: mockRecipeRepository,
        },
        input
      )

      expect(mockRecipeRepository.findRecipesByKeywords).toHaveBeenCalled()

      expect(recipes).toEqual(expected)
    }
  })

  test("if recipes for the provided keywords are in the cache, should not use the recipe repository and return cached values", async () => {
    const testCases = [
      {
        input: ["onion", "tomato"],
        expected: () =>
          expect(mockRecipeRepository.findRecipesByKeywords).toHaveBeenCalled(),
      },
      {
        input: ["onion", "tomato"],
        expected: () =>
          expect(
            mockRecipeRepository.findRecipesByKeywords
          ).not.toHaveBeenCalled(),
      },
      {
        input: ["potato", "apple"],
        expected: () =>
          expect(mockRecipeRepository.findRecipesByKeywords).toHaveBeenCalled(),
      },
    ]

    for (const { input, expected } of testCases) {
      jest.clearAllMocks()

      mockRecipeRepository.findRecipesByKeywords.mockResolvedValueOnce([])

      await findRecipes(
        {
          recipeRepository: mockRecipeRepository,
        },
        input
      )

      expected()
    }
  })
})
