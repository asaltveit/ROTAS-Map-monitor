import './vitest.setup'
import { beforeAll } from 'vitest'
import { isSupabaseAvailable } from '../helpers/supabase'

beforeAll(async () => {
  const available = await isSupabaseAvailable()
  if (!available) {
    throw new Error(
      'Local Supabase is not running. Start it with: supabase start',
    )
  }
})
