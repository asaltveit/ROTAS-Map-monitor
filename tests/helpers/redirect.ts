export class RedirectError extends Error {
  constructor(public url: string) {
    super(`Redirect to ${url}`)
    this.name = 'RedirectError'
  }
}

export function getRedirectUrl(error: unknown): string | null {
  if (error instanceof RedirectError) {
    return error.url
  }
  return null
}
