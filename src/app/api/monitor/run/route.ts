import { NextResponse } from 'next/server'
import { persistMonitorCheck, runMonitorChecks } from '@/lib/monitor/runChecks'

export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runMonitorChecks()
    const checkId = await persistMonitorCheck(result)

    return NextResponse.json({
      ok: true,
      checkId,
      status: result.status,
      alertCount: result.alerts.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Monitor check failed',
      },
      { status: 500 },
    )
  }
}
