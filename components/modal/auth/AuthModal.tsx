"use client";

import { Dialog } from "@/components/ui/dialog";
import { authModalStateAtom } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/forum/clientApp";
import { Flex, Separator } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthInputs from "./AuthInputs";
import ResetPassword from "./ResetPassword";
import OAuthButtons from "./oauth-buttons/OAuthButtons";

/**
 * Auth modal that switches between login, signup, and reset views based on atom state.
 * Auto-closes when Firebase auth yields a user.
 * @returns Dialog shell with auth form or reset password flow.
 * @see https://chakra-ui.com/docs/components/dialog
 */
const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useAtom(authModalStateAtom);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Dialog.Root
      open={modalState.open}
      onOpenChange={({ open }: { open: boolean }) => {
        if (!open) handleClose();
      }}
    >
      <Dialog.Content maxW="400px">
        <Dialog.Header textAlign="center" display="flex" justifyContent="center">
          <Dialog.Title textAlign="center" width="100%">
            {modalState.view === "login" && "Login"}
            {modalState.view === "signup" && "Sign Up"}
            {modalState.view === "resetPassword" && "Reset Password"}
          </Dialog.Title>
        </Dialog.Header>

        <Dialog.CloseTrigger />

        <Dialog.Body
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          pb={6}
        >
          <Flex
            direction="column"
            align="center"
            justify="center"
            width="100%"
            maxW="340px"
          >
            {/* If user is trying to authenticate (log in or sign up) */}
            {modalState.view === "login" || modalState.view === "signup" ? (
              <>
                <OAuthButtons />
                {/* <Text color='gray.500' fontWeight={700}>OR</Text> */}
                <Separator />
                <AuthInputs />
              </>
            ) : (
              // If user is trying to reset password
              <ResetPassword />
            )}
          </Flex>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};
export default AuthModal;
