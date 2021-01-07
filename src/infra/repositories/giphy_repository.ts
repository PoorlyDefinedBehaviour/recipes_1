import { Either, left, right } from "fp-ts/lib/Either"
import { env } from "../../config/env"
import Gif from "../../domain/entities/gif"
import * as http from "../http"

interface PaginatedResponse<T> {
  data: T[]
  pagination: { offset: number; total_count: number; count: number }
  meta: {
    msg: string
    status: number
    response_id: string
  }
}

export const findGifByText = async (
  text: string
): Promise<Either<Error, Gif>> => {
  try {
    // this is only here in case giphy key is not working again
    if (process.env.DEBUG) {
      return right({
        url: "https://media.giphy.com/media/xBRhcST67lI2c/giphy.gif",
      })
    }

    const { data } = await http.get<PaginatedResponse<Gif>>(
      `${env.GIF_API_URL}/gifs/search`,
      {
        query: {
          q: text,
          api_key: env.GIF_API_KEY,
          rating: "pg-13",
          limit: 1,
        },
        retries: 3,
      }
    )

    return right({ url: data[0].url })
  } catch (error) {
    return left(error)
  }
}
