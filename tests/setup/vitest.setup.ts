import { config as loadEnv } from 'dotenv'
import path from 'node:path'

loadEnv({ path: path.resolve(process.cwd(), '.env.test'), override: false })

process.env.CRON_SECRET ??= 'test-cron-secret'
process.env.ROTAS_MAP_URL ??= 'http://127.0.0.1:9999'
process.env.NEXT_PUBLIC_ROTAS_MAP_URL ??= 'http://127.0.0.1:9999'
process.env.NEXT_PUBLIC_APP_URL ??= 'http://127.0.0.1:3000'
