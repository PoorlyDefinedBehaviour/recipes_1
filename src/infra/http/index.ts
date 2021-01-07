import got from "got"

type Query = Record<string, string | number | undefined>

const toQueryString = (query?: Query) => {
  if (!query) {
    return ""
  }

  return Object.entries(query)
    .filter(([_key, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
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
