import * as React from 'react'
import { cva  } from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority';

import { cn } from '#/lib/utils.ts'
import { Button as ButtonPrimitive } from '@base-ui/react/button'

const RAISED_3D =
  'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),inset_0_-2px_0_0_rgba(0,0,0,0.15),0_5px_0_0_rgba(0,0,0,0.35),0_8px_14px_-4px_rgba(0,0,0,0.4)] ' +
  'hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-110 ' +
  'hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_-2px_0_0_rgba(0,0,0,0.15),0_7px_0_0_rgba(0,0,0,0.35),0_12px_20px_-4px_rgba(0,0,0,0.45)] ' +
  'active:translate-y-[5px] active:scale-[0.98] active:brightness-95 ' +
  'active:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_-1px_0_0_rgba(0,0,0,0.15)] ' +
  'transition-[transform,box-shadow,filter] duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default: `bg-primary text-primary-foreground hover:bg-primary/90 ${RAISED_3D}`,
        destructive: `bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 ${RAISED_3D}`,
        outline: `border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 ${RAISED_3D}`,
        secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80 ${RAISED_3D}`,
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    ref?: React.RefObject<HTMLButtonElement | null>
    asChild?: boolean
  }) {
  if (asChild && React.isValidElement(children) && React.Children.count(children) === 1) {
    return (
      <ButtonPrimitive
        data-slot="button"
        render={children}
        nativeButton={false}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
