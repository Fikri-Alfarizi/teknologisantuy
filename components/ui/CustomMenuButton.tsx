import { Menu } from "@/components/ui/menu";
import { Flex, Text } from "@chakra-ui/react";

interface CustomMenuButtonProps {
  icon: React.ReactElement;
  text: string;
  onClick: () => void;
}

/**
 * A styled menu item component designed for use within Chakra UI menus.
 * Combines an icon and text with consistent hover states and layout.
 * @param icon - The icon element to display.
 * @param text - The label text for the menu item.
 * @param onClick - Callback triggered when the menu item is clicked.
 * @returns A themed menu item component.
 */
const CustomMenuButton: React.FC<CustomMenuButtonProps> = ({
  icon,
  text,
  onClick,
}) => {
  return (
    <Menu.Item
      fontSize="10pt"
      fontWeight={700}
      onClick={onClick}
      height="40px"
      borderRadius={10}
      alignContent="center"
      _hover={{
        bg: { base: "gray.300", _dark: "gray.600" },
        color: { base: "black", _dark: "white" },
      }}
    >
      <Flex align="center">
        <Flex fontSize={20} mr={3} align="center" justify="center" width="20px" height="20px">
          {icon}
        </Flex>
        <Text fontWeight={600}>{text}</Text>
      </Flex>
    </Menu.Item>
  );
};

export default CustomMenuButton;
