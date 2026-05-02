import { useCallback, useEffect, useState } from 'react'

function readVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

/**
 * Read & write a CSS custom property on `document.documentElement`.
 * On mount, reads the live value; setter writes back so other components
 * using the same var react to changes.
 */
export function useCssVar(name: string, fallback: string): [string, (value: string) => void] {
  const [value, setValue] = useState(() => readVar(name, fallback))

  useEffect(() => {
    setValue(readVar(name, fallback))
  }, [name, fallback])

  const setVar = useCallback(
    (next: string) => {
      document.documentElement.style.setProperty(name, next)
      setValue(next)
    },
    [name]
  )

  return [value, setVar]
}
