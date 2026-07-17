import type { ReactNode } from 'react'

import { Label } from '#/components/ui/label.tsx'

export function fieldErrors(
  field: { state: { meta: { errors: unknown } } },
): string[] {
  const errors = field.state.meta.errors
  if (!errors || typeof errors !== 'object') return []

  const result: string[] = []
  const map = errors as Record<string, unknown>

  for (const key of Object.keys(map)) {
    const val = map[key]
    if (Array.isArray(val)) {
      for (const item of val) {
        if (typeof item === 'string') {
          result.push(item)
        } else if (item && typeof item === 'object' && 'message' in item) {
          result.push(String((item as { message: unknown }).message))
        }
      }
    } else if (typeof val === 'string') {
      result.push(val)
    }
  }

  return result
}

export function FormField({
  label,
  children,
  errors,
  htmlFor,
}: {
  label: string
  children: ReactNode
  errors?: string[]
  htmlFor?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {errors?.length
        ? errors.map((e) => (
            <p key={e} className="text-xs text-destructive">
              {e}
            </p>
          ))
        : null}
    </div>
  )
}
