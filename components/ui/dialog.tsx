import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react"
import * as React from "react"

export const DialogRoot = ChakraDialog.Root as any
export const DialogFooter = ChakraDialog.Footer as any
export const DialogHeader = ChakraDialog.Header as any
export const DialogBody = ChakraDialog.Body as any
export const DialogBackdrop = ChakraDialog.Backdrop as any
export const DialogTitle = ChakraDialog.Title as any
export const DialogDescription = ChakraDialog.Description as any
export const DialogTrigger = ChakraDialog.Trigger as any
export const DialogActionTrigger = ChakraDialog.ActionTrigger as any
export const DialogPositioner = ChakraDialog.Positioner as any

export interface DialogContentProps extends ChakraDialog.ContentProps {
  children: React.ReactNode
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  backdrop?: boolean
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    const { children, ...rest } = props

    return (
      <ChakraDialog.Positioner {...({} as any)}>
        <ChakraDialog.Content ref={ref} {...(rest as any)}>
          {children}
        </ChakraDialog.Content>
      </ChakraDialog.Positioner>
    )
  },
)

export const DialogCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  ChakraDialog.CloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
  return (
    <ChakraDialog.CloseTrigger
      ref={ref}
      {...(props as any)}
    />
  )
})

export const Dialog = {
  Root: DialogRoot,
  Footer: DialogFooter,
  Header: DialogHeader,
  Body: DialogBody,
  Backdrop: DialogBackdrop,
  Title: DialogTitle,
  Description: DialogDescription,
  Trigger: DialogTrigger,
  ActionTrigger: DialogActionTrigger,
  Content: DialogContent,
  CloseTrigger: DialogCloseTrigger,
  Positioner: DialogPositioner,
} as any
