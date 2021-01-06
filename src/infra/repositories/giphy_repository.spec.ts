import { isLeft, Right } from "fp-ts/lib/Either"
import nock from "nock"
import faker from "faker"
import { env } from "../../config/env"
import { findGifByText } from "./giphy_repository"
import Gif from "../../domain/entities/gif"

beforeEach(() => nock.cleanAll())

describe("gif repository unit test suite", () => {
  describe("findGifByText", () => {
    test("when http request fails should return Either.left(error)", async () => {
      nock(`${env.GIF_API_URL}/gifs/search?q=potato`)
        .get(/.*/)
        .reply(500, "oops")
        .persist()

      const result = await findGifByText("potato")

      expect(isLeft(result)).toBe(true)
    })

    test("when http request succeeds should return Either.right(Gif)", async () => {
      const gif = { url: faker.internet.url() }

      nock(`${env.GIF_API_URL}/gifs/search?q=potato`)
        .get(/.*/)
        .reply(200, {
          data: [gif],
          pagination: {
            offset: 0,
            total_count: 1,
            count: 1,
          },
          meta: {
            msg: "",
            status: 200,
            response_id: faker.random.alphaNumeric(12),
          },
        })
        .persist()

      const result = await findGifByText("potato")

      expect(isLeft(result)).toBe(false)

      expect((result as Right<Gif>).right).toEqual(gif)
    })
  })
})
