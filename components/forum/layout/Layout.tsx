import React, { ReactNode } from "react";
import Navbar from "../navbar/Navbar";
import GlobalHooks from "./GlobalHooks";
import ForumVotingOverlay from "./ForumVotingOverlay";
import { Box } from "@chakra-ui/react";

interface LayoutProps {
  children: ReactNode;
}

/**
 * The primary layout wrapper for all pages in the application.
 * Injects global hooks for data bootstrapping and renders the persistent navbar.
 * @param children - The page-specific content to be rendered within the layout.
 * @returns A layout shell containing the navbar and main content area.
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <GlobalHooks />
      <Box position="fixed" inset={0} overflow="hidden" zIndex={1000}>
        {/* Everything inside here will be blurred */}
        <Box filter="blur(10px)" opacity={0.75} pointerEvents="none" userSelect="none">
          <Navbar />
          <Box as="main" minH="100vh">
            {children}
          </Box>
        </Box>

        {/* Voting Overlay - outside the blur */}
        <ForumVotingOverlay />
      </Box>
    </>
  );
};
export default Layout;
