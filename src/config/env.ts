import dotenv from "dotenv"

const getDotEnvFilePath = () => {
  const nodeEnv = process.env.NODE_ENV

  if (!nodeEnv) {
    throw new Error(
      "NODE_ENV must at least start with one of: [test, dev, prod]"
    )
  }

  if (/test/.test(nodeEnv)) {
    return "env.testing"
  }
  if (/dev/.test(nodeEnv)) {
    return ".env"
  }
  if (/prod/.test(nodeEnv)) {
    // get env variables from somewhere else, like hashicorp vault?
    return ".env"
  }

  throw new Error(`Unexpected NODE_ENV: ${nodeEnv}`)
}

const dotEnvFilePath = getDotEnvFilePath()

const { parsed } = dotenv.config({ path: dotEnvFilePath })

if (!parsed) {
  throw new Error(`failed to parsed env file: ${dotEnvFilePath}`)
}

const get = (key: string): string => {
  const value = parsed[key]

  if (!value) {
    throw new Error(`missing env key: ${key}`)
  }
  return value
}

const keys = ["NODE_ENV", "RECIPE_API_URL"] as const

export const env = Object.fromEntries(keys.map(key => [key, get(key)])) as {
  [key in typeof keys[number]]: string
}