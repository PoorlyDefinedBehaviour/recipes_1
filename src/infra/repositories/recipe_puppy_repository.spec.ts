import { isLeft, isRight, Right } from "fp-ts/lib/Either"
import nock from "nock"
import faker from "faker"
import { env } from "../../config/env"
import { findRecipesByKeywords } from "./recipe_puppy_repository"
import Recipe from "../../domain/entities/recipe"

beforeEach(() => nock.cleanAll())

describe("recipe puppy repository unit test suite", () => {
  describe("findRecipesByKeywords", () => {
    test("when http request fails should return Either.left(error)", async () => {
      nock(`${env.RECIPE_API_URL}?i=onion,potato`)
        .get(/.*/)
        .reply(500, "oops")
        .persist()

      const testCases = [
        { keywords: ["onion", "potato"] },
        {
          keywords: ["onion", "potato"],
          options: { page: faker.random.number({ min: 0 }) },
        },
        {
          keywords: ["onion", "potato"],
          options: { page: faker.random.number({ min: 0 }) },
        },
        {
          keywords: [],
          options: { query: faker.random.alphaNumeric(5) },
        },
      ]

      const results = await Promise.all(
        testCases.map(({ keywords, options }) =>
          findRecipesByKeywords(keywords, options)
        )
      )

      for (const result of results) {
        expect(isLeft(result)).toBe(true)
      }
    })

    test("should return a list of recipes where each recipe ingredients is an array ordered alphabetically", async () => {
      nock(`${env.RECIPE_API_URL}?i=onion,potato`)
        .get(/.*/)
        .reply(200, {
          title: "foo",
          version: 1.0,
          hfref: "bar",
          results: [
            {
              title: "Vegetable-Pasta Oven Omelet",
              href:
                "http://find.myrecipes.com/recipes/recipefinder.dyn?action=displayRecipe&recipe_id=520763",
              ingredients: "c,b,   a",
              thumbnail: "http://img.recipepuppy.com/560556.jpg",
            },
          ],
        })
        .persist()

      const result = (await findRecipesByKeywords([
        "onion",
        "potato",
      ])) as Right<Recipe[]>

      expect(isRight(result)).toBe(true)

      expect(result.right.length).toBe(1)

      expect(result.right[0].ingredients).toEqual(["a", "b", "c"])
    })
  })
})
