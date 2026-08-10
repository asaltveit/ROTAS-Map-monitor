type Check = {
  id: number
  checked_at: string
  status: string
  map_http_status: number | null
  map_response_ms: number | null
  locations_count: number | null
  rpc_ok: boolean | null
}

export default function ChecksTable({ checks }: { checks: Check[] }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">Recent checks</h2>
      </div>
      {checks.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-500">No checks recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Time</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">HTTP</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Response</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Locations</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">RPC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {checks.map((check) => (
                <tr key={check.id}>
                  <td className="px-4 py-3">
                    {new Date(check.checked_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 capitalize">{check.status}</td>
                  <td className="px-4 py-3">{check.map_http_status ?? '—'}</td>
                  <td className="px-4 py-3">
                    {check.map_response_ms != null
                      ? `${check.map_response_ms} ms`
                      : '—'}
                  </td>
                  <td className="px-4 py-3">{check.locations_count ?? '—'}</td>
                  <td className="px-4 py-3">
                    {check.rpc_ok == null ? '—' : check.rpc_ok ? 'OK' : 'Fail'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
