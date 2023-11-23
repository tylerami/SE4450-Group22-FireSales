import React, { useEffect, useState } from "react";
import SalesTeamListWidget from "./team/SalesTeamListWidget";
import { Box, Flex, Heading, IconButton, Menu, Spacer } from "@chakra-ui/react";
import { User } from "../../../models/User";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Conversion } from "models/Conversion";
import { UserService } from "services/interfaces/UserService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { ConversionService } from "services/interfaces/ConversionService";
import { PayoutService } from "services/interfaces/PayoutService";
import { Payout } from "models/Payout";
import { CompensationGroup } from "models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import UserPerformanceWidget from "./performance/UserPerformanceWidget";
import AdminConversionHistoryWidget from "./conversions/AdminConversionHistoryWidget";
import Filter, { FilterDefinition } from "components/utils/Filter";

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
      const users = await userService.getAll({ includeAdmins: true });
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

  const getUserConversions = (): Conversion[] =>
    conversions.filter((conversion) => {
      return conversion.userId === selectedUser?.uid;
    });

  const [displayPerformanceWidget, setDisplayPerformanceWidget] =
    useState<boolean>(true);
  const toggleDisplayPerformanceWidget = () => {
    setDisplayPerformanceWidget(!displayPerformanceWidget);
  };

  const [selectedCompGroup, setSelectedCompGroup] =
    useState<CompensationGroup | null>(null);

  const assignCompGroup = async (compGroup: CompensationGroup | null) => {
    if (!selectedUser) return;

    setSelectedCompGroup(compGroup);
    selectedUser.compensationGroupId = compGroup?.id ?? null;
    await userService.update(selectedUser);
  };

  const selectUser = (user: User | null) => {
    setSelectedUser(user);
    if (user === null) return;
    const compGroup: CompensationGroup | undefined = compensationGroups.find(
      (compGroup) => compGroup.id === user.compensationGroupId
    );

    setSelectedCompGroup(compGroup ?? null);
  };

  const filterDefinition: FilterDefinition<CompensationGroup> = {
    options: [null, ...compensationGroups],
    onChange: (group: CompensationGroup | null) => assignCompGroup(group),
    label: (group: CompensationGroup | null) => {
      if (!group) return "UNASSIGNED";
      return group.id;
    },
    refresh: undefined,
    value: selectedCompGroup,
  };

  return (
    <Flex w="100%" alignItems={"center"} direction={"column"} gap={8}>
      <Box />
      {selectedUser ? (
        <Flex gap={8} w="100%" px={8} direction={"column"}>
          <Flex alignItems={"center"} alignSelf={"left"} width={"100%"}>
            <IconButton
              size="md"
              onClick={() => selectUser(null)}
              aria-label="icon-button"
              icon={<ChevronLeftIcon />}
            />
            <Heading mx={6} size="xl" fontWeight={400} color="#ED7D31">
              {selectedUser.getFullName()}
            </Heading>
            <Spacer />
            <Heading mx={4} size="sm" fontWeight={400}>
              Compensation Group:
            </Heading>
            <Filter filter={filterDefinition} />
          </Flex>

          <AdminConversionHistoryWidget
            conversions={getUserConversions()}
            togglePerformanceWidget={toggleDisplayPerformanceWidget}
          />
          {displayPerformanceWidget && (
            <UserPerformanceWidget
              user={selectedUser}
              conversions={getUserConversions()}
            />
          )}
        </Flex>
      ) : (
        <SalesTeamListWidget
          setSelectedUser={selectUser}
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
