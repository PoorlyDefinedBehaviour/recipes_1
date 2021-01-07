import dotenv from "dotenv"

const getDotEnvFilePath = () => {
  const nodeEnv = process.env.NODE_ENV

  if (!nodeEnv) {
    throw new Error(
      "NODE_ENV must at least start with one of: [test, dev, prod]"
    )
  }

  if (/test/.test(nodeEnv)) {
    return ".env.testing"
  }
  if (/dev/.test(nodeEnv)) {
    return ".env"
  }
  if (/prod/.test(nodeEnv)) {
    // get env variables from somewhere else, like hashicorp vault instead?
    return ".env"
  }

  throw new Error(`Unexpected NODE_ENV: ${nodeEnv}`)
}

dotenv.config({ path: getDotEnvFilePath() })

const get = (key: string): string => {
  const value = process.env[key]

  if (!value) {
    throw new Error(`missing env key: ${key}`)
  }
  return value
}

const keys = [
  "NODE_ENV",
  "PORT",
  "RECIPE_API_URL",
  "GIF_API_URL",
  "GIF_API_KEY",
] as const

type EnvValues = {
  [key in typeof keys[number]]: string
}

type Environment = {
  isProduction: boolean
  isDevelopment: boolean
  isTesting: boolean
}

const values = Object.fromEntries(keys.map(key => [key, get(key)])) as EnvValues

type Env = EnvValues & Environment

export const env: Env = {
  ...values,
  isProduction: /prod/.test(values.NODE_ENV),
  isDevelopment: /dev/.test(values.NODE_ENV),
  isTesting: /test/.test(values.NODE_ENV),
}
