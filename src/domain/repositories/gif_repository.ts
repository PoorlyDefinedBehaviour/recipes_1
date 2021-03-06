import { Either } from "fp-ts/lib/Either"
import Gif from "../entities/gif"

export interface GifRepository {
  findGifByText: (text: string) => Promise<Either<Error, Gif>>
}
