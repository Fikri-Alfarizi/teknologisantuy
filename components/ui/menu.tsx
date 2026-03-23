import { Menu as ChakraMenu, Portal } from "@chakra-ui/react"
import * as React from "react"

export const MenuRoot = ChakraMenu.Root as any
export const MenuTrigger = ChakraMenu.Trigger as any
export const MenuContent = ChakraMenu.Content as any
export const MenuItem = ChakraMenu.Item as any
export const MenuPositioner = ChakraMenu.Positioner as any
export const MenuList = ChakraMenu.Content as any // Sometimes used as alias

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Positioner: MenuPositioner,
  List: MenuList,
} as any
