import { isLeft, isRight, getOrElse } from "fp-ts/lib/Either"
import nock from "nock"
import faker from "faker"
import { env } from "../../config/env"
import { findGifsByText } from "./giphy_repository"
import Gif from "../../domain/entities/gif"

beforeEach(() => nock.cleanAll())

describe("gif repository unit test suite", () => {
  describe("findGifsByText", () => {
    test("when http request fails should return Either.left(error)", async () => {
      nock(`${env.GIF_API_URL}/gifs/search?q=potato`)
        .get(/.*/)
        .reply(500, "oops")
        .persist()

      const result = await findGifsByText("potato")

      expect(isLeft(result)).toBe(true)
    })

    test("when http request succeeds should return Either.left(error)", async () => {
      const gifs = [{ url: faker.internet.url() }]

      nock(`${env.GIF_API_URL}/gifs/search?q=potato`)
        .get(/.*/)
        .reply(200, {
          data: gifs,
          pagination: {
            offset: 0,
            total_count: gifs.length,
            count: gifs.length,
          },
          meta: {
            msg: "",
            status: 200,
            response_id: faker.random.alphaNumeric(12),
          },
        })
        .persist()

      const result = await findGifsByText("potato")

      expect(isRight(result)).toBe(true)

      expect(getOrElse(() => [] as Gif[])(result)).toEqual(gifs)
    })
  })
})
