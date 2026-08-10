export type UserRole = 'editor' | 'admin'

export type UserProfile = {
  user_id: string
  role: UserRole
  created_at?: string
}
