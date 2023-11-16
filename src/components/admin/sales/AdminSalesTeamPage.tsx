import React, { useEffect, useState } from "react";
import SalesTeamListWidget from "./team/SalesTeamListWidget";
import { Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import { User } from "../../../models/User";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Conversion } from "@models/Conversion";
import { UserService } from "services/interfaces/UserService";
import { DependencyInjection } from "utils/DependencyInjection";
import { ConversionService } from "services/interfaces/ConversionService";
import { PayoutService } from "services/interfaces/PayoutService";
import { Payout } from "models/Payout";
import { CompensationGroup } from "models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import UserPerformanceWidget from "./performance/UserPerformanceWidget";
import AdminConversionHistoryWidget from "./conversions/AdminConversionHistoryWidget";

type Props = {};

const AdminSalesTeamPage = (props: Props) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [compensationGroups, setCompensationGroups] = useState<
    CompensationGroup[]
  >([]);
  const userService: UserService = DependencyInjection.userService();
  const conversionService: ConversionService =
    DependencyInjection.conversionService();
  const payoutService: PayoutService = DependencyInjection.payoutService();

  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await userService.getAll();
      setUsers(users);
    };

    const fetchConversions = async () => {
      const conversions = await conversionService.query({});
      setConversions(conversions);
    };

    const fetchPayouts = async () => {
      const payout = await payoutService.query({});
      setPayouts(payout);
    };

    const fetchCompGroups = async () => {
      const compGroups = await compGroupService.getAll();
      setCompensationGroups(compGroups);
    };

    fetchCompGroups();
    fetchUsers();
    fetchConversions();
    fetchPayouts();
  }, [compGroupService, conversionService, payoutService, userService]);

  const selectedUserConversions: Conversion[] = conversions.filter(
    (conversion) => {
      return true; //conversion.userId === selectedUser?.uid;
    }
  );

  const [displayPerformanceWidget, setDisplayPerformanceWidget] =
    useState<boolean>(true);
  const toggleDisplayPerformanceWidget = () => {
    setDisplayPerformanceWidget(!displayPerformanceWidget);
  };

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

          <AdminConversionHistoryWidget
            conversions={selectedUserConversions}
            togglePerformanceWidget={toggleDisplayPerformanceWidget}
          />
          {displayPerformanceWidget && (
            <UserPerformanceWidget
              user={selectedUser}
              conversions={selectedUserConversions}
            />
          )}
        </Flex>
      ) : (
        <SalesTeamListWidget
          setSelectedUser={setSelectedUser}
          compGroups={compensationGroups}
          conversions={conversions}
          users={users}
          payouts={payouts}
        />
      )}
      <Box h={20} />
    </Flex>
  );
};

export default AdminSalesTeamPage;
