import request from "supertest"
import StatusCodes from "http-status-codes"
import nock from "nock"
import faker from "faker"
import { app } from "../server"

describe("recipe controller integration test suite", () => {
  describe("GET /recipes", () => {
    test("when no ingredients are provided, should return an error", async () => {
      const response = await request(app)
        .get("/recipes")
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body).toEqual({
        message: "at least 1 ingredient must be informed",
      })
    })

    test("when more than 3 ingredients are provided, should return an error", async () => {
      const response = await request(app)
        .get("/recipes?i=apple,banana,potato,onion")
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body).toEqual({
        message: "inform 3 ingredients maximum",
      })
    })

    test("when ingredients are provided, should fetch recipes based on them", async () => {
      const gif = { url: faker.internet.url() }

      nock(/giphy/)
        .get(/.*/)
        .reply(200, { data: [gif] })
        .persist()

      const recipes = [
        {
          title: "something with potatos",
          href: faker.internet.url(),
          ingredients: "potato, rice, beans",
          thumbnail: faker.image.food(),
        },
        {
          title: "something with onions",
          href: faker.internet.url(),
          ingredients: "onions, cheese, chicken",
          thumbnail: faker.image.food(),
        },
      ]

      nock(/recipepuppy/)
        .get(/.*/)
        .reply(200, {
          title: "a",
          version: 1.0,
          href: "b",
          results: recipes,
        })
        .persist()

      const ingredients = ["potato", "onion"]

      const response = await request(app)
        .get(`/recipes?i=${String(ingredients)}`)
        .expect(StatusCodes.OK)

      expect(response.body.keywords).toEqual(ingredients)

      expect(response.body.recipes).toEqual([
        {
          title: recipes[0].title,
          link: recipes[0].href,
          ingredients: ["beans", "potato", "rice"],
          gif: gif.url,
        },
        {
          title: recipes[1].title,
          link: recipes[1].href,
          ingredients: ["cheese", "chicken", "onions"],
          gif: gif.url,
        },
      ])
    })
  })
})
