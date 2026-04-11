import { Tabs as ChakraTabs } from "@chakra-ui/react"
import * as React from "react"

export const TabsRoot = ChakraTabs.Root as any
export const TabsList = ChakraTabs.List as any
export const TabsTrigger = ChakraTabs.Trigger as any
export const TabsIndicator = ChakraTabs.Indicator as any

export interface TabsContentProps extends ChakraTabs.ContentProps {
  children?: React.ReactNode
  value: string
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent(props, ref) {
    return <ChakraTabs.Content ref={ref} {...(props as any)} />
  },
)

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
  Indicator: TabsIndicator,
} as any
