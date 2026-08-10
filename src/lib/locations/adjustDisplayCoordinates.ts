/** Degrees offset per ring — tuned for orthographic map projection */
export const OFFSET_STEP = 0.15

/** Decimal places used to group locations at the same original site */
export const CLUSTER_PRECISION = 4

export function clusterKey(lat: number, lng: number): string {
  return `${lat.toFixed(CLUSTER_PRECISION)},${lng.toFixed(CLUSTER_PRECISION)}`
}

export function displayCoordsForIndex(
  originalLat: number,
  originalLng: number,
  index: number,
): { latitude: number; longitude: number } {
  if (index === 0) {
    return { latitude: originalLat, longitude: originalLng }
  }

  const ring = Math.ceil(index / 8)
  const posInRing = (index - 1) % 8
  const angle = (posInRing / 8) * 2 * Math.PI
  const radius = ring * OFFSET_STEP

  return {
    latitude: originalLat + radius * Math.cos(angle),
    longitude: originalLng + radius * Math.sin(angle),
  }
}

type ClusterMember = {
  id: number
  original_latitude: number
  original_longitude: number
}

export function computeDisplayUpdates(
  members: ClusterMember[],
  clusterOriginalLat: number,
  clusterOriginalLng: number,
): Array<{ id: number; latitude: number; longitude: number }> {
  const sorted = [...members].sort((a, b) => a.id - b.id)

  return sorted.map((member, index) => ({
    id: member.id,
    ...displayCoordsForIndex(clusterOriginalLat, clusterOriginalLng, index),
  }))
}

export function sameCluster(
  latA: number,
  lngA: number,
  latB: number,
  lngB: number,
): boolean {
  return clusterKey(latA, lngA) === clusterKey(latB, lngB)
}
