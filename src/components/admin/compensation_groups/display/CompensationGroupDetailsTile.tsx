import { Flex, Heading, Text, Spacer, Box } from "@chakra-ui/react";
import React from "react";

import { Button } from "@chakra-ui/react";
import { CompensationGroup } from "src/models/CompensationGroup";
import CompGroupAffiliateDealsTable from "./CompGroupAffiliateDealsTable";
import CompGroupRetentionIncentivesTable from "./CompGroupRetentionIncentivesTable";
import { Client } from "src/models/Client";
import { Conversion } from "src/models/Conversion";
import { User } from "src/models/User";
import useConfirmationModal from "components/utils/ConfirmationModal";
import useSuccessNotification from "components/utils/SuccessNotification";

type Props = {
  compGroup: CompensationGroup;
  selectCompGroup: (compGroup: CompensationGroup) => void;
  deleteCompGroup: (compGroup: CompensationGroup) => void;
  clients: Client[];
  conversions: Conversion[];
  users: User[];
};

const CompensationGroupDetailsTile = ({
  compGroup,
  selectCompGroup,
  deleteCompGroup,
  clients,
  conversions,
  users,
}: Props) => {
  const collapsedUsersLength = 5;

  const [usersCollapsed, setUsersCollapsed] = React.useState<boolean>(true);
  const usersOverflowing: boolean = users.length > collapsedUsersLength;

  const { openModal, ConfirmationModal } = useConfirmationModal();

  const showSuccess = useSuccessNotification();

  const handleDeleteButtonClick = () => {
    openModal({
      modalText: `Are you sure you want to delete the compensation group "${compGroup.id}"?`,
      onConfirm: () => {
        deleteCompGroup(compGroup);
        showSuccess({
          message: `Successfully deleted compensation group "${compGroup.id}"`,
        });
      },
    });
  };

  return (
    <Flex
      borderRadius={"12px"}
      p={6}
      pt={2}
      gap={2}
      border="1px solid #E2E8F0"
      opacity={compGroup.enabled ? 1 : 0.7}
      w="100%"
      direction={"column"}
    >
      <ConfirmationModal />
      <Flex w="100%" gap={6} alignItems={"center"}>
        <GroupProperty label={"Group ID"} value={compGroup.id} />

        <Spacer />
        {!compGroup.enabled && (
          <Text fontStyle={"italic"} fontWeight={600}>
            Disabled
          </Text>
        )}

        <Button w={40} onClick={(_) => selectCompGroup(compGroup)}>
          Edit
        </Button>
        <Button onClick={handleDeleteButtonClick} colorScheme="red">
          Delete
        </Button>
      </Flex>

      {users.length > 0 && (
        <Flex alignItems={"center"} w="full">
          {usersOverflowing && (
            <Button
              alignSelf={"start"}
              p={4}
              size="xs"
              onClick={(_) => setUsersCollapsed(!usersCollapsed)}
            >
              {usersCollapsed ? "Expand Users" : "Collapse Users"}
            </Button>
          )}

          <Text
            fontWeight={"bold"}
            fontSize="sm"
          >{`Users (${users.length}):`}</Text>
          <Text mx={2} maxW={"80%"} fontSize="sm">
            {users
              .slice(0, usersCollapsed ? 5 : undefined)
              .map((user) => user.getFullName())
              .join(", ") + (usersOverflowing ? "..." : "")}
          </Text>
          <Spacer />
        </Flex>
      )}

      <CompGroupAffiliateDealsTable
        conversions={conversions}
        affiliateLinks={Object.values(compGroup.affiliateLinks)}
      />

      <Box h={1} />
      <CompGroupRetentionIncentivesTable
        conversions={conversions}
        retentionIncentives={compGroup.retentionIncentives}
        clients={clients}
        users={users}
      />
    </Flex>
  );
};

const GroupProperty = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <Flex direction={"row"} gap={2} alignItems={"center"}>
      <Text fontSize={"md"}>{label}:</Text>
      <Heading color="#ED7D31" size="md">
        {value}
      </Heading>
    </Flex>
  );
};

export default CompensationGroupDetailsTile;
