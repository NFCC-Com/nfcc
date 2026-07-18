import * as React from 'react'

import { useIsMobile } from '#/hooks/use-mobile.ts'
import { cn } from '#/lib/utils.ts'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog.tsx'
import {
  AlertDrawer,
  AlertDrawerAction,
  AlertDrawerCancel,
  AlertDrawerContent,
  AlertDrawerDescription,
  AlertDrawerFooter,
  AlertDrawerHeader,
  AlertDrawerTitle,
} from '#/components/ui/alert-drawer.tsx'

function ResponsiveAlertDialog(props: React.ComponentProps<typeof AlertDialog>) {
  const isMobile = useIsMobile()
  return isMobile ? <AlertDrawer {...props} /> : <AlertDialog {...props} />
}

function ResponsiveAlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogContent>) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <AlertDrawerContent className={className} {...props} />
  ) : (
    <AlertDialogContent className={cn('max-h-[90vh] overflow-y-auto', className)} {...props} />
  )
}

function ResponsiveAlertDialogHeader(props: React.ComponentProps<typeof AlertDialogHeader>) {
  const isMobile = useIsMobile()
  return isMobile ? <AlertDrawerHeader {...props} /> : <AlertDialogHeader {...props} />
}

function ResponsiveAlertDialogFooter(props: React.ComponentProps<typeof AlertDialogFooter>) {
  const isMobile = useIsMobile()
  return isMobile ? <AlertDrawerFooter {...props} /> : <AlertDialogFooter {...props} />
}

function ResponsiveAlertDialogTitle(props: React.ComponentProps<typeof AlertDialogTitle>) {
  const isMobile = useIsMobile()
  return isMobile ? <AlertDrawerTitle {...props} /> : <AlertDialogTitle {...props} />
}

function ResponsiveAlertDialogDescription(
  props: React.ComponentProps<typeof AlertDialogDescription>,
) {
  const isMobile = useIsMobile()
  return isMobile ? <AlertDrawerDescription {...props} /> : <AlertDialogDescription {...props} />
}

function ResponsiveAlertDialogAction(props: React.ComponentProps<typeof AlertDialogAction>) {
  const isMobile = useIsMobile()
  return isMobile ? <AlertDrawerAction {...props} /> : <AlertDialogAction {...props} />
}

function ResponsiveAlertDialogCancel(props: React.ComponentProps<typeof AlertDialogCancel>) {
  const isMobile = useIsMobile()
  return isMobile ? <AlertDrawerCancel {...props} /> : <AlertDialogCancel {...props} />
}

export {
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogCancel,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogTitle,
}
