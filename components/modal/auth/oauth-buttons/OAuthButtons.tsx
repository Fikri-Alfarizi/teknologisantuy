import { Box, Flex, Stack } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/forum/clientApp";
import AuthButton from "./AuthButton";
import AuthenticationErrorMessage from "./ErrorMessage";

/**
 * Displays third party authentication providers, in this case Google and GitHub.
 * When a provider is clicked:
 *  - A new account is created if the user does not already exist
 *  - Logs in if it is an existing user
 *  - An error is displayed if the user already exist with a different provider.
 * @returns {React.FC} - OAuthButtons component
 *
 * @see https://github.com/CSFrequency/react-firebase-hooks/tree/master/auth
 */
const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(auth);
  const [signInWithGithub, userGitHub, loadingGitHub, errorGitHub] =
    useSignInWithGithub(auth);

  /**
   * Creates or updates a Firestore user document when a user authenticates via OAuth.
   * This ensures that profile data like displayName and photoURL are synchronized.
   * @param user - The authenticated Firebase user.
   */
  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(
      userDocRef,
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      { merge: true } // Merge to avoid overwriting existing non-Google data
    );
  };

  /**
   * Automatically triggers user document creation after successful Google authentication.
   */
  useEffect(() => {
    if (userGoogle) {
      createUserDocument(userGoogle.user);
    }
  }, [userGoogle]);

  /**
   * Automatically triggers user document creation after successful GitHub authentication.
   */
  useEffect(() => {
    if (userGitHub) {
      createUserDocument(userGitHub.user);
    }
  }, [userGitHub]);

  return (
    <Box width="100%">
      <Stack direction="row" gap={4} width="100%" mb={1.5} mt={2} justify="center">
        {/* Google */}
        <AuthButton
          provider="Google"
          loading={loadingGoogle}
          onClick={() => signInWithGoogle()}
          icon={<FcGoogle size={22} />}
        />

        {/* GitHub */}
        <AuthButton
          provider="GitHub"
          loading={loadingGitHub}
          onClick={() => signInWithGithub()}
          icon={<FaGithub size={22} />}
        />
      </Stack>

      {/* If there is error than the error is shown */}
      <>
        <AuthenticationErrorMessage error={errorGoogle} />
        <AuthenticationErrorMessage error={errorGitHub} />
      </>
    </Box>
  );
};

export default OAuthButtons;
