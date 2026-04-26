const KEY_PREFIX = 'jf-app-builder:preset:'

export interface PresetSnapshot {
  appTitle: string
  appSubtitle: string
  pages: unknown
  headerActions: unknown
}

function key(presetId: string) {
  return `${KEY_PREFIX}${presetId}`
}

export function loadSnapshot(presetId: string): PresetSnapshot | null {
  try {
    const raw = localStorage.getItem(key(presetId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PresetSnapshot>
    if (
      typeof parsed.appTitle !== 'string' ||
      typeof parsed.appSubtitle !== 'string' ||
      !Array.isArray(parsed.pages) ||
      !Array.isArray(parsed.headerActions)
    ) return null
    return parsed as PresetSnapshot
  } catch {
    return null
  }
}

export function saveSnapshot(presetId: string, snapshot: PresetSnapshot): void {
  try {
    localStorage.setItem(key(presetId), JSON.stringify(snapshot))
  } catch {
    // Ignore quota / serialization errors — persistence is best-effort.
  }
}

export function clearSnapshot(presetId: string): void {
  try {
    localStorage.removeItem(key(presetId))
  } catch {
    // Ignore.
  }
}

export function loadStoredAppTitle(presetId: string): string | null {
  return loadSnapshot(presetId)?.appTitle ?? null
}
