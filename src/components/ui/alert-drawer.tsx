import * as React from 'react'
import { AlertDialog as AlertDrawerPrimitive } from '@base-ui/react/alert-dialog'

import { cn } from '#/lib/utils.ts'
import { buttonVariants } from '#/components/ui/button.tsx'

function AlertDrawer(props: AlertDrawerPrimitive.Root.Props) {
  return <AlertDrawerPrimitive.Root data-slot="alert-drawer" {...props} />
}

function AlertDrawerTrigger(props: AlertDrawerPrimitive.Trigger.Props) {
  return <AlertDrawerPrimitive.Trigger data-slot="alert-drawer-trigger" {...props} />
}

function AlertDrawerPortal(props: AlertDrawerPrimitive.Portal.Props) {
  return <AlertDrawerPrimitive.Portal data-slot="alert-drawer-portal" {...props} />
}

function AlertDrawerOverlay({ className, ...props }: AlertDrawerPrimitive.Backdrop.Props) {
  return (
    <AlertDrawerPrimitive.Backdrop
      data-slot="alert-drawer-overlay"
      className={cn(
        'data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className,
      )}
      {...props}
    />
  )
}

function AlertDrawerContent({ className, children, ...props }: AlertDrawerPrimitive.Popup.Props) {
  return (
    <AlertDrawerPortal>
      <AlertDrawerOverlay />
      <AlertDrawerPrimitive.Popup
        data-slot="alert-drawer-content"
        className={cn(
          'bg-background data-[open]:animate-in data-[closed]:animate-out data-[closed]:slide-out-to-bottom data-[open]:slide-in-from-bottom fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col gap-4 rounded-t-xl border-t border-border shadow-lg transition ease-in-out data-[closed]:duration-200 data-[open]:duration-300',
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </AlertDrawerPrimitive.Popup>
    </AlertDrawerPortal>
  )
}

function AlertDrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-drawer-header"
      className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function AlertDrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-drawer-footer"
      className={cn('mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function AlertDrawerTitle({ className, ...props }: AlertDrawerPrimitive.Title.Props) {
  return (
    <AlertDrawerPrimitive.Title
      data-slot="alert-drawer-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  )
}

function AlertDrawerDescription({ className, ...props }: AlertDrawerPrimitive.Description.Props) {
  return (
    <AlertDrawerPrimitive.Description
      data-slot="alert-drawer-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function AlertDrawerAction({ className, ...props }: AlertDrawerPrimitive.Close.Props) {
  return <AlertDrawerPrimitive.Close className={cn(buttonVariants(), className)} {...props} />
}

function AlertDrawerCancel({ className, ...props }: AlertDrawerPrimitive.Close.Props) {
  return (
    <AlertDrawerPrimitive.Close
      className={cn(buttonVariants({ variant: 'outline' }), className)}
      {...props}
    />
  )
}

export {
  AlertDrawer,
  AlertDrawerAction,
  AlertDrawerCancel,
  AlertDrawerContent,
  AlertDrawerDescription,
  AlertDrawerFooter,
  AlertDrawerHeader,
  AlertDrawerOverlay,
  AlertDrawerPortal,
  AlertDrawerTitle,
  AlertDrawerTrigger,
}
