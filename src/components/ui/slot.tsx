import * as React from 'react'

interface SlotProps {
  children?: React.ReactNode
}

export const Slot = {
  Root: function SlotRoot({
    children,
    ...props
  }: SlotProps & Record<string, unknown>) {
    if (React.isValidElement(children) && React.Children.count(children) === 1) {
      return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, props)
    }
    return <>{children}</>
  },
}
