import React, { useState } from "react";
import SalesTeamListWidget from "./SalesTeamListWidget";
import { Box, Flex, Heading, Icon, IconButton, Spacer } from "@chakra-ui/react";
import CompensationGroupWidget from "./CompensationGroupWidget";
import { User } from "../../../models/User";
import UserPerformanceSummaryWidget from "./user_management/performance/UserPerformanceSummaryWidget";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import UserManagementWidget from "./user_management/UserManagementWidget";

type Props = {};

const AdminSalesTeamPage = (props: Props) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <Flex w="100%" alignItems={"center"} direction={"column"} gap={8}>
      <Box />
      {selectedUser ? (
        <Flex gap={8} w="100%" px={8} direction={"column"}>
          <Flex alignItems={"center"} alignSelf={"left"} width={"100%"}>
            <IconButton
              size="md"
              onClick={() => setSelectedUser(null)}
              aria-label="icon-button"
              icon={<ChevronLeftIcon />}
            />
            <Heading mx={6} size="xl" fontWeight={400} color="#ED7D31">
              Tyler
            </Heading>
          </Flex>

          <UserManagementWidget />
          <UserPerformanceSummaryWidget />
        </Flex>
      ) : (
        <React.Fragment>
          <SalesTeamListWidget setSelectedUser={setSelectedUser} />
          <CompensationGroupWidget></CompensationGroupWidget>
        </React.Fragment>
      )}
      <Box h={20} />
    </Flex>
  );
};

export default AdminSalesTeamPage;
