import { beforeEach, describe, expect, it, vi } from 'vitest'
import { updateUserRole } from '@/app/login/actions'
import { getRedirectUrl, RedirectError } from '../helpers/redirect'

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new RedirectError(url)
  }),
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/auth/getUserProfile', () => ({
  requireAdmin: vi.fn().mockResolvedValue({
    user_id: 'admin-user-id',
    role: 'admin',
    created_at: new Date().toISOString(),
  }),
}))

describe('updateUserRole', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('blocks changing your own role', async () => {
    const formData = new FormData()
    formData.set('userId', 'admin-user-id')
    formData.set('role', 'editor')

    await expect(updateUserRole(formData)).rejects.toSatisfy((error: unknown) => {
      const url = getRedirectUrl(error)
      return url?.includes('cannot+change+your+own+role') ?? false
    })
  })
})
