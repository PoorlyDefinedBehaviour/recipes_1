import got from "got"

type Query = Record<string, string | number>

const toQueryString = (query?: Query) => {
  if (!query) {
    return ""
  }

  return Object.entries(query)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&")
}

type Options = {
  retries?: number
  query?: Query
}

export const get = <T>(url: string, options: Options): Promise<T> =>
  got
    .get(`${url}?${toQueryString(options.query)}`, { retry: options.retries })
    .json()
