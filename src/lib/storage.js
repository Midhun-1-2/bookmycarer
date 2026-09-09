const PREFIX = 'bmc:'

// Bump this whenever files in src/mock-data/*.json change shape or content.
// On mismatch, every visitor's stale bmc: data is wiped once so it re-seeds
// from the current files — without this, a browser that already has data
// saved keeps reusing it forever and never picks up seed updates.
const SEED_VERSION = '2'
const VERSION_KEY = PREFIX + 'seed-version'

function ensureFreshSeed() {
  try {
    if (localStorage.getItem(VERSION_KEY) === SEED_VERSION) return
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX) && k !== VERSION_KEY)
      .forEach((k) => localStorage.removeItem(k))
    localStorage.setItem(VERSION_KEY, SEED_VERSION)
  } catch {
    // localStorage unavailable (private mode, disabled storage) — readStore
    // below will hit the same limitation and simply not persist.
  }
}

ensureFreshSeed()

export function readStore(key, seed) {
  const raw = localStorage.getItem(PREFIX + key)
  if (raw === null) {
    localStorage.setItem(PREFIX + key, JSON.stringify(seed))
    return structuredClone(seed)
  }
  try {
    return JSON.parse(raw)
  } catch {
    return structuredClone(seed)
  }
}

export const STORE_CHANGE_EVENT = 'bmc:store-change'

export function writeStore(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
  // Lets badges/counters outside the writing component stay in sync.
  window.dispatchEvent(new CustomEvent(STORE_CHANGE_EVENT, { detail: { key } }))
}

export function clearAllMockData() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k))
}
