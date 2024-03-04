import React, { useEffect, useState } from "react";
import SalesTeamListWidget from "./team/SalesTeamListWidget";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import { User } from "src/models/User";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Conversion } from "src/models/Conversion";
import { UserService } from "services/interfaces/UserService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import { ConversionService } from "services/interfaces/ConversionService";
import { PayoutService } from "services/interfaces/PayoutService";
import { Payout } from "src/models/Payout";
import {
  ADMIN_COMP_GROUP_ID,
  CompensationGroup,
} from "src/models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import UserPerformanceWidget from "./performance/UserPerformanceWidget";
import AdminConversionHistoryWidget from "./conversions/AdminConversionHistoryWidget";
import Filter, { FilterDefinition } from "components/utils/Filter";
import useSuccessNotification from "components/utils/SuccessNotification";
import { Role } from "src/models/enums/Role";
import { ConversionType } from "src/models/enums/ConversionType";

type Props = {};

const AdminSalesTeamPage = (props: Props) => {
  // state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [compensationGroups, setCompensationGroups] = useState<
    CompensationGroup[]
  >([]);

  // services
  const userService: UserService = DependencyInjection.userService();
  const conversionService: ConversionService =
    DependencyInjection.conversionService();
  const payoutService: PayoutService = DependencyInjection.payoutService();

  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  // fetch data
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);
  const refresh = () => setUpdateTrigger(updateTrigger + 1);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await userService.getAll({ includeAdmins: true });
      setUsers(users);
    };

    const fetchConversions = async () => {
      let conversions = await conversionService.query({
        includeUnassigned: true,
      });
      conversions = conversions.filter(
        (conv) => conv.type !== ConversionType.retentionIncentive
      );
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
  }, [
    compGroupService,
    conversionService,
    payoutService,
    userService,
    updateTrigger,
  ]);

  const getUserConversions = (): Conversion[] =>
    conversions.filter((conversion) => {
      return conversion.userId === selectedUser?.uid;
    });

  const [isConversionSelected, setIsConversionSelected] =
    useState<boolean>(false);

  const displayPerformanceWidget =
    !isConversionSelected && selectedUser !== null;

  const showSuccess = useSuccessNotification();

  const [selectedCompGroup, setSelectedCompGroup] =
    useState<CompensationGroup | null>(null);

  const assignCompGroup = async (compGroup: CompensationGroup | null) => {
    if (!selectedUser) return;

    setSelectedCompGroup(compGroup);
    selectedUser.updateCompGroup(compGroup);
    await userService.update(selectedUser);
    showSuccess({
      message: `Compensation group updated to ${
        compGroup?.id ?? "UNASSIGNED"
      }.`,
    });
  };

  const selectUser = (user: User | null) => {
    setSelectedUser(user);
    if (user === null) {
      refresh();
      return;
    }
    const compGroup: CompensationGroup | undefined = compensationGroups.find(
      (compGroup) => compGroup.id === user.compensationGroupId
    );
    setSelectedCompGroup(compGroup ?? null);
  };

  const deselectUser = () => {
    setSelectedUser(null);
    refresh();
  };

  const compGroupFilterDef: FilterDefinition<CompensationGroup> = {
    options: [null, ...compensationGroups],
    onChange: (group: CompensationGroup | null) => assignCompGroup(group),
    label: (group: CompensationGroup | null) => {
      if (!group) return "UNASSIGNED";
      return group.id;
    },
    value: selectedCompGroup,
  };

  const toggleAdmin = async () => {
    if (!selectedUser) return;

    const updatedUser: User = new User({
      ...selectedUser,
      compensationGroupId: ADMIN_COMP_GROUP_ID,
      roles: selectedUser.isAdmin()
        ? [Role.salesperson]
        : [Role.salesperson, Role.admin],
    });
    await userService.update(updatedUser);
    selectUser(updatedUser);
  };

  return (
    <Flex w="100%" alignItems={"center"} direction={"column"} gap={8}>
      <Box />
      {selectedUser ? (
        <Flex gap={8} w="100%" px={8} direction={"column"}>
          <Flex alignItems={"center"} alignSelf={"left"} width={"100%"}>
            <IconButton
              size="md"
              onClick={deselectUser}
              aria-label="icon-button"
              icon={<ChevronLeftIcon />}
            />
            <Heading mx={6} size="lg" fontWeight={400} color="#ED7D31">
              {selectedUser.getFullName()}
            </Heading>
            {selectedUser.isAdmin() && (
              <Button
                size="sm"
                isActive={false}
                _hover={{
                  cursor: "default",
                }}
              >
                ADMIN
              </Button>
            )}
            <Spacer />
            <Button
              colorScheme={!selectedUser.isAdmin() ? "red" : "blackAlpha"}
              size="sm"
              onClick={toggleAdmin}
            >
              {selectedUser.isAdmin() ? "Remove Admin" : "Make Admin"}
            </Button>

            <React.Fragment>
              <Heading mx={4} size="sm" fontWeight={400}>
                Compensation Group:
              </Heading>
              <Filter filter={compGroupFilterDef} />
            </React.Fragment>
          </Flex>

          <AdminConversionHistoryWidget
            conversions={getUserConversions()}
            setConversionIsSelected={setIsConversionSelected}
            refresh={refresh}
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
