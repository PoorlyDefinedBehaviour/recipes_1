import { env } from "./config/env"
import { startServer } from "./presentation/rest/server"

startServer()
  // eslint-disable-next-line no-console
  .then(() => console.log(`Listening on PORT: ${env.PORT}`))
  // eslint-disable-next-line no-console
  .catch(console.error)
