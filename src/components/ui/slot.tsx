import * as React from 'react'

interface SlotProps {
  children?: React.ReactNode
}

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
) {
  const merged: Record<string, unknown> = { ...slotProps, ...childProps }

  for (const key in childProps) {
    const slotValue = slotProps[key]
    const childValue = childProps[key]
    const isHandler = /^on[A-Z]/.test(key)

    if (isHandler) {
      if (typeof slotValue === 'function' && typeof childValue === 'function') {
        merged[key] = (...args: unknown[]) => {
          childValue(...args)
          slotValue(...args)
        }
      } else if (slotValue) {
        merged[key] = slotValue
      }
    } else if (key === 'style') {
      merged[key] = { ...(slotValue as object | undefined), ...(childValue as object | undefined) }
    } else if (key === 'className') {
      merged[key] = [slotValue, childValue].filter(Boolean).join(' ')
    }
  }

  return merged
}

export const Slot = {
  Root: function SlotRoot({
    children,
    ...props
  }: SlotProps & Record<string, unknown>) {
    if (React.isValidElement(children) && React.Children.count(children) === 1) {
      const child = children as React.ReactElement<Record<string, unknown>>
      return React.cloneElement(child, mergeProps(props, child.props))
    }
    return <>{children}</>
  },
}
