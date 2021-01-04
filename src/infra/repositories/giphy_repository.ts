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

export const findGifsByText = async (
  text: string
): Promise<Either<Error, Gif[]>> => {
  try {
    const { data } = await http.get<PaginatedResponse<Gif>>(
      `${env.GIF_API_URL}/gifs/search`,
      {
        query: { q: text },
        retries: 3,
      }
    )

    const gifs = data.map(gif => ({ url: gif.url }))

    return right(gifs)
  } catch (error) {
    return left(error)
  }
}
