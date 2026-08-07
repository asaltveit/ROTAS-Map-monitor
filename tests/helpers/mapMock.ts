import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const mapUrl = process.env.ROTAS_MAP_URL ?? 'http://127.0.0.1:9999'

export const mapHandlers = [
  http.get(mapUrl, () =>
    HttpResponse.text('ok', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    }),
  ),
]

export const mapServer = setupServer(...mapHandlers)

export function startMapMock(): void {
  mapServer.listen({ onUnhandledRequest: 'bypass' })
}

export function stopMapMock(): void {
  mapServer.close()
}

export function mockMapDown(): void {
  mapServer.use(
    http.get(mapUrl, () => HttpResponse.text('error', { status: 503 })),
  )
}

export function mockMapSlow(): void {
  mapServer.use(
    http.get(mapUrl, async () => {
      await new Promise((resolve) => setTimeout(resolve, 3500))
      return HttpResponse.text('ok', { status: 200 })
    }),
  )
}

export function resetMapMock(): void {
  mapServer.resetHandlers(...mapHandlers)
}
