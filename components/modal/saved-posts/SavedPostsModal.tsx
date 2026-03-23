import { savedPostStateAtom } from "@/atoms/savedPostsAtom";
import useSavedPosts from "@/hooks/posts/useSavedPosts";
import { Dialog } from "@/components/ui/dialog";
import {
  Flex,
  Icon,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import Link from "next/link";
import React from "react";
import { LuTrash } from "react-icons/lu";
import { FaReddit } from "react-icons/fa";

/**
 * Modal listing saved posts with quick navigation and remove controls.
 * Relies on saved post atom for visibility and content.
 * Allows users to view their saved posts and navigate to them or their communities.
 * @returns Dialog with list items linking to posts and communities.
 */
const SavedPostsModal: React.FC = () => {
  const [savedPostState, setSavedPostState] = useAtom(savedPostStateAtom);
  const { onRemoveSavedPost } = useSavedPosts();

  /**
   * Closes the modal by toggling atom state.
   */
  const handleClose = () => {
    setSavedPostState((prev) => ({ ...prev, isOpen: false }));
  };

  /**
   * Modal listing saved posts with quick navigation and remove controls.
   * Relies on saved post atom for visibility and content.
   * @returns Dialog with list items linking to posts and communities.
   */
  return (
    <Dialog.Root
      open={savedPostState.isOpen}
      onOpenChange={(e: { open: boolean }) =>
        setSavedPostState((prev) => ({ ...prev, isOpen: e.open }))
      }
      size="lg"
    >
      <Dialog.Content borderRadius={10}>
        <Dialog.Header>
          <Dialog.Title>Saved Posts</Dialog.Title>
        </Dialog.Header>
        <Dialog.CloseTrigger />
        <Dialog.Body pb={6} rounded={"xl"}>
          <Stack gap={4}>
            {savedPostState.savedPosts.length === 0 ? (
              <Text color="gray.500" textAlign="center">
                No saved posts yet.
              </Text>
            ) : (
              savedPostState.savedPosts.map((item) => (
                <Flex
                  key={item.id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="xl"
                  align="center"
                  justify="space-between"
                  _hover={{ borderColor: "gray.400" }}
                >
                  <Flex align="center" flex={1} gap={3}>
                    {item.communityImageURL ? (
                      <Image
                        src={item.communityImageURL}
                        borderRadius="full"
                        boxSize="40px"
                        alt="Community Image"
                      />
                    ) : (
                      <Icon as={FaReddit} fontSize={40} color="brand.100" />
                    )}
                    <Stack gap={0}>
                      <Link
                        href={`/community/${item.communityId}/comments/${item.postId}`}
                        onClick={handleClose}
                      >
                        <Text
                          fontWeight="bold"
                          fontSize="lg"
                          _hover={{ textDecoration: "underline" }}
                        >
                          {item.postTitle}
                        </Text>
                      </Link>
                      <Link
                        href={`/community/${item.communityId}`}
                        onClick={handleClose}
                      >
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          _hover={{ textDecoration: "underline" }}
                        >
                          r/{item.communityId}
                        </Text>
                      </Link>
                    </Stack>
                  </Flex>
                  <Icon
                    as={LuTrash}
                    cursor="pointer"
                    color="gray.500"
                    mr={2}
                    fontSize={20}
                    _hover={{ color: "red.500" }}
                    onClick={() => onRemoveSavedPost(item.postId)}
                  />
                </Flex>
              ))
            )}
          </Stack>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SavedPostsModal;
