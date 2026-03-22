import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";

interface AuthButtonProps {
  provider: string;
  loading: boolean;
  onClick: () => void;
  icon: React.ReactElement;
}

/**
 * OAuth provider button used in the auth modal.
 * @param provider - Provider label shown on the button.
 * @param loading - Shows spinner while sign-in is pending.
 * @param onClick - Handler to trigger provider flow.
 * @param icon - Logo displayed beside the label.
 * @returns Styled button for third-party auth.
 */
const AuthButton: React.FC<AuthButtonProps> = ({
  provider,
  loading,
  onClick,
  icon,
}) => {
  return (
    <Button
      flexGrow={1}
      variant={"oauth" as any}
      loading={loading}
      onClick={onClick}
    >
      <Flex align="center" justify="center">
        {icon}
        <Text ml={2}>{provider}</Text>
      </Flex>
    </Button>
  );
};

export default AuthButton;
