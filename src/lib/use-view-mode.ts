import * as React from 'react'

export type ViewMode = 'table' | 'cards'

const STORAGE_KEY = 'dashboard-view-mode'

function readStored(): ViewMode {
  if (typeof window === 'undefined') return 'table'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'cards' ? 'cards' : 'table'
}

export function useViewMode() {
  const [mode, setMode] = React.useState<ViewMode>('table')

  React.useEffect(() => {
    setMode(readStored())
  }, [])

  const update = React.useCallback((next: ViewMode) => {
    setMode(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  return [mode, update] as const
}
