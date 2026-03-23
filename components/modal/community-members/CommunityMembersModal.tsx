"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import {
  Box,
  Flex,
  IconButton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CommunityMember } from "@/types/communityMember";
import useCommunityMembers from "@/hooks/community/useCommunityMembers";
import { LuTrash } from "react-icons/lu";
import { useAtomValue } from "jotai";
import { communityStateAtom } from "@/atoms/communitiesAtom";
import useCommunityPermissions from "@/hooks/community/useCommunityPermissions";
import useRemoveCommunityMember from "@/hooks/community/useRemoveCommunityMember";
import ConfirmationDialog from "@/components/modal/ConfirmationDialog";

type CommunityMembersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  communityId: string;
};

/**
 * Modal that lists community members and allows admins to remove subscribers.
 * Fetches members on open to keep the list fresh.
 * @param isOpen - Whether the modal is visible.
 * @param onClose - Callback to close the modal.
 * @param communityId - Community whose members are shown.
 * @returns Dialog with member cards and optional remove actions.
 */
const CommunityMembersModal: React.FC<CommunityMembersModalProps> = ({
  isOpen,
  onClose,
  communityId,
}) => {
  const { members, loading, error, loadMembers } = useCommunityMembers();
  const memberCount = members?.length ?? 0;
  const communityStateValue = useAtomValue(communityStateAtom);
  const { isAdmin } = useCommunityPermissions(
    communityStateValue.currentCommunity
  );
  const { removeMember, loading: removeLoading } = useRemoveCommunityMember();
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    loadMembers(communityId);
  }, [isOpen, communityId, loadMembers]);

  const handleRemoveMember = async (memberId: string) => {
    const success = await removeMember(communityId, memberId);
    if (success) {
      loadMembers(communityId);
    }
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;
    await handleRemoveMember(memberToRemove);
    setMemberToRemove(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Flex justify="center" py={10}>
          <Spinner />
        </Flex>
      );
    }

    if (!members.length) {
      return (
        <Flex justify="center" py={10} px={4} textAlign="center">
          <Text color="gray.500">
            {error ? "Failed to load subscribers." : "No subscribers found."}
          </Text>
        </Flex>
      );
    }

    return (
      <Stack gap={2}>
        {members.map((member: CommunityMember) => (
          <Flex
            key={member.uid}
            borderWidth="1px"
            borderRadius="xl"
            p={3}
            borderColor={{ base: "gray.200", _dark: "gray.700" }}
            align="center"
            justify="space-between"
          >
            <Box>
              <Text fontWeight="semibold">
                {member.displayName?.trim() ? member.displayName : "No Name"}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {member.email}
              </Text>
            </Box>
            {isAdmin && (
              <IconButton
                variant="ghost"
                colorPalette="red"
                size="sm"
                aria-label="Remove member"
                onClick={() => setMemberToRemove(member.uid)}
              >
                <LuTrash />
              </IconButton>
            )}
          </Flex>
        ))}
      </Stack>
    );
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details: { open: boolean }) => !details.open && onClose()}
      placement="center"
    >
      <Dialog.Content maxH="70vh" borderRadius="xl">
        <Dialog.Header>
          <Dialog.Title>
            {memberCount} Community Member{memberCount === 1 ? "" : "s"}
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.CloseTrigger />
        <Dialog.Body pb={6} overflowY="auto">
          {renderContent()}
        </Dialog.Body>
      </Dialog.Content>
      <ConfirmationDialog
        open={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={confirmRemoveMember}
        title="Remove Member"
        body="Are you sure you want to remove this member from the community?"
        confirmButtonText="Remove"
        isLoading={removeLoading}
      />
    </Dialog.Root>
  );
};

export default CommunityMembersModal;
