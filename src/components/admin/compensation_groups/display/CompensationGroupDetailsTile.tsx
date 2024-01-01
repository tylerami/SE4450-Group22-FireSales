import { Flex, Heading, Text, Spacer, Box } from "@chakra-ui/react";
import React from "react";

import { Button } from "@chakra-ui/react";
import { CompensationGroup } from "models/CompensationGroup";
import CompGroupAffiliateDealsTable from "./CompGroupAffiliateDealsTable";
import CompGroupRetentionIncentivesTable from "./CompGroupRetentionIncentivesTable";
import { Client } from "models/Client";
import { Conversion } from "models/Conversion";
import { User } from "models/User";

type Props = {
  compGroup: CompensationGroup;
  selectCompGroup: (compGroup: CompensationGroup) => void;
  clients: Client[];
  conversions: Conversion[];
  users: User[];
};

const CompensationGroupDetailsTile = ({
  compGroup,
  selectCompGroup,
  clients,
  conversions,
  users,
}: Props) => {
  const collapsedUsersLength = 5;

  const [usersCollapsed, setUsersCollapsed] = React.useState<boolean>(true);
  const usersOverflowing: boolean = users.length > collapsedUsersLength;

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
      <Flex w="100%" gap={10} alignItems={"center"}>
        <GroupProperty label={"Group ID"} value={compGroup.id} />

        <Spacer />
        {!compGroup.enabled && (
          <Text fontStyle={"italic"} fontWeight={600}>
            Disabled
          </Text>
        )}

        <Button onClick={(_) => selectCompGroup(compGroup)}>Edit</Button>
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

          <Text maxW={"80%"} fontSize="sm">
            {[...users, ...users, ...users, ...users, ...users, ...users]
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
