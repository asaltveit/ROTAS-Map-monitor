'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth/getUserProfile'
import { parseLocationForm } from '@/lib/locations/parseLocationForm'
import { recomputeClusterDisplayCoords } from '@/lib/locations/recomputeCluster'
import { createClient } from '@/utils/supabase/server'

export type ActionState = {
  error?: string
  success?: string
}

export async function addLocation(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const profile = await requireAuth()
  const parsed = parseLocationForm(formData)

  if (!parsed.ok) {
    return { error: parsed.error }
  }

  const supabase = await createClient()
  const input = parsed.data

  const { data: inserted, error: insertError } = await supabase
    .from('locations')
    .insert({
      original_latitude: input.original_latitude,
      original_longitude: input.original_longitude,
      latitude: input.original_latitude,
      longitude: input.original_longitude,
      location_type: input.location_type,
      created_year_start: input.created_year_start,
      created_year_end: input.created_year_end ?? null,
      discovered_year: input.discovered_year ?? null,
      script: input.script ?? null,
      text: input.text ?? null,
      place: input.place ?? null,
      location: input.location ?? null,
      first_word: input.first_word ?? null,
      shelfmark: input.shelfmark ?? null,
      created_by: profile.user_id,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (insertError || !inserted) {
    return { error: insertError?.message ?? 'Failed to add location' }
  }

  try {
    await recomputeClusterDisplayCoords(
      input.original_latitude,
      input.original_longitude,
    )
  } catch (error) {
    await supabase.from('locations').delete().eq('id', inserted.id)
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Failed to compute display coordinates',
    }
  }

  await supabase.from('location_audit_log').insert({
    location_id: inserted.id,
    action: 'insert',
    actor_id: profile.user_id,
    payload: input,
  })

  revalidatePath('/private/locations')
  redirect('/private/locations')
}

export async function deleteLocation(formData: FormData): Promise<void> {
  const profile = await requireAuth()
  const idValue = formData.get('id')

  if (typeof idValue !== 'string') {
    redirect('/private/locations?error=Invalid+location')
  }

  const id = Number.parseInt(idValue, 10)
  if (Number.isNaN(id)) {
    redirect('/private/locations?error=Invalid+location')
  }

  const supabase = await createClient()

  const { data: existing, error: fetchError } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    redirect('/private/locations?error=Location+not+found')
  }

  const originalLat = Number(existing.original_latitude ?? existing.latitude)
  const originalLng = Number(existing.original_longitude ?? existing.longitude)

  const { error: deleteError } = await supabase
    .from('locations')
    .delete()
    .eq('id', id)

  if (deleteError) {
    redirect('/private/locations?error=Failed+to+delete+location')
  }

  await supabase.from('location_audit_log').insert({
    location_id: id,
    action: 'delete',
    actor_id: profile.user_id,
    payload: existing,
  })

  if (!Number.isNaN(originalLat) && !Number.isNaN(originalLng)) {
    await recomputeClusterDisplayCoords(originalLat, originalLng)
  }

  revalidatePath('/private/locations')
  redirect('/private/locations')
}
