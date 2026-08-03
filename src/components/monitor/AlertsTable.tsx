import { acknowledgeAlert } from '@/app/login/actions'

type Alert = {
  id: number
  severity: string
  alert_type: string
  message: string
  acknowledged_at: string | null
}

export default function AlertsTable({ alerts }: { alerts: Alert[] }) {
  const openAlerts = alerts.filter((alert) => !alert.acknowledged_at)

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">Alerts</h2>
      </div>
      {openAlerts.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-500">No open alerts.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Severity</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Message</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {openAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td className="px-4 py-3 capitalize">{alert.severity}</td>
                  <td className="px-4 py-3">{alert.alert_type}</td>
                  <td className="px-4 py-3">{alert.message}</td>
                  <td className="px-4 py-3">
                    <form action={acknowledgeAlert}>
                      <input type="hidden" name="alertId" value={alert.id} />
                      <button
                        type="submit"
                        className="rounded-md bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-300"
                      >
                        Acknowledge
                      </button>
                    </form>
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
