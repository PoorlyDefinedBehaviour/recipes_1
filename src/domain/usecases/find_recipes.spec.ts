import { isRight, right, Right } from "fp-ts/Either"
import faker from "faker"
import mem from "mem"
import makeFindRecipes from "./find_recipes"
import Recipe from "../entities/recipe"

const mockRecipeRepository = {
  findRecipesByKeywords: jest.fn(),
}
const mockGifRepository = {
  findGifByText: jest.fn(),
}

const findRecipes = makeFindRecipes({
  recipeRepository: mockRecipeRepository,
  gifRepository: mockGifRepository,
})

const mockRecipe = {
  title: "Greek Omelet with Feta",
  ingredients: [
    "eggs",
    "feta cheese",
    "garlic",
    "red onions",
    "spinach",
    "tomato",
    "water",
  ],
  link: "http://www.kraftfoods.com/kf/recipes/greek-omelet-feta-104508.aspx",
}

beforeEach(() => jest.clearAllMocks())

describe("find recipes use case test suite", () => {
  test("should return a list of recipes with gifs based on the provided keywords", async () => {
    const recipes = [mockRecipe]

    mockRecipeRepository.findRecipesByKeywords.mockResolvedValueOnce(
      right(recipes)
    )

    const gif = {
      url: faker.internet.url(),
    }

    mockGifRepository.findGifByText.mockResolvedValueOnce(right(gif))

    const expected = recipes.map(recipe => ({ ...recipe, gif: gif.url }))

    const recipesWithGifs = await findRecipes(["onion", "tomato"])

    expect(mockRecipeRepository.findRecipesByKeywords).toHaveBeenCalled()
    expect(mockRecipeRepository.findRecipesByKeywords).toHaveBeenCalledTimes(
      recipes.length
    )

    expect(isRight(recipesWithGifs)).toBe(true)

    expect((recipesWithGifs as Right<Recipe[]>).right).toEqual(expected)
  })

  test("if recipes for the provided keywords are in the cache, should return cached values", async () => {
    jest.clearAllMocks()
    mem.clear(findRecipes)

    mockRecipeRepository.findRecipesByKeywords.mockResolvedValueOnce(
      right([mockRecipe])
    )

    mockGifRepository.findGifByText.mockResolvedValueOnce(
      right({
        url: faker.internet.url(),
      })
    )

    await findRecipes(["onion", "tomato"])

    expect(mockRecipeRepository.findRecipesByKeywords).toHaveBeenCalledTimes(1)

    expect(mockGifRepository.findGifByText).toHaveBeenCalledTimes(1)

    await findRecipes(["onion", "tomato"])

    expect(mockRecipeRepository.findRecipesByKeywords).toHaveBeenCalledTimes(1)

    expect(mockGifRepository.findGifByText).toHaveBeenCalledTimes(1)
  })
})
