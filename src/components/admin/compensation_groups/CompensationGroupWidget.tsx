import {
  Button,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import CompensationGroupEditor from "./editor/CompensationGroupEditor";
import { CompensationGroup } from "src/models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import CompensationGroupDetailsTile from "./display/CompensationGroupDetailsTile";
import { UserService } from "services/interfaces/UserService";
import { ConversionService } from "services/interfaces/ConversionService";
import { ClientService } from "services/interfaces/ClientService";
import { Client } from "src/models/Client";
import { Conversion } from "src/models/Conversion";
import { User } from "src/models/User";
import { FiSearch } from "react-icons/fi";

type Props = {};

const CompensationGroupWidget = (props: Props) => {
  const [createMode, setCreateMode] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<CompensationGroup | null>(
    null
  );

  const [updateTrigger, setUpdateTrigger] = useState<number>(0);
  const [compGroups, setCompGroups] = useState<CompensationGroup[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [usersSearch, setUserSearch] = useState<string>("");

  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const userService: UserService = DependencyInjection.userService();

  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const clientsService: ClientService = DependencyInjection.clientService();

  useEffect(() => {
    const fetchCompGroups = async () => {
      const compGroups = await compGroupService.getAll();
      setCompGroups(compGroups);
    };

    const fetchClients = async () => {
      const clients = await clientsService.getAll();
      setClients(clients);
    };

    const fetchConversions = async () => {
      const conversions = await conversionService.query({});
      setConversions(conversions);
    };

    const fetchUsers = async () => {
      const users = await userService.getAll();
      setUsers(users);
    };

    fetchUsers();
    fetchConversions();
    fetchCompGroups();
    fetchClients();
  }, [
    clientsService,
    compGroupService,
    conversionService,
    updateTrigger,
    userService,
  ]);

  const exit = () => {
    setCreateMode(false);
    setEditingGroup(null);
    setUpdateTrigger(updateTrigger + 1);
  };

  function getFilteredCompGroups() {
    if (usersSearch.trim() === "") {
      return compGroups;
    }

    const filteredUsers: User[] = users.filter((user) =>
      user.getFullName().toLowerCase().includes(usersSearch.toLowerCase())
    );

    const userSearchMatches: Record<string, number> = {};

    for (const user of filteredUsers) {
      if (user.compensationGroupId! in userSearchMatches) {
        userSearchMatches[user.compensationGroupId!] = 0;
      }
      userSearchMatches[user.compensationGroupId!] += 1;
    }

    const filteredCompGroups = compGroups.filter(
      (compGroup) => compGroup.id in userSearchMatches
    );

    filteredCompGroups.sort((a, b) => {
      return userSearchMatches[b.id] - userSearchMatches[a.id];
    });

    return filteredCompGroups;
  }

  const deleteCompGroup = async (compGroup: CompensationGroup) => {
    await compGroupService.delete(compGroup);
    setUpdateTrigger(updateTrigger + 1);
  };

  const filteredCompGroups = getFilteredCompGroups();

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      width={"95%"}
      gap={4}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      {createMode || editingGroup ? (
        <CompensationGroupEditor exisitingGroup={editingGroup} exit={exit} />
      ) : (
        <React.Fragment>
          <Flex justifyContent={"start"}>
            <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
              Compensation Groups
            </Heading>{" "}
            <Spacer />
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => setCreateMode(true)}
            >
              Create New Group
            </Button>
          </Flex>

          <InputGroup w="full" maxW="50%">
            <InputLeftElement>
              <Icon _hover={{ color: "#434343" }} as={FiSearch} />
            </InputLeftElement>
            <Input
              focusBorderColor="#ED7D31"
              variant="filled"
              placeholder="Search by user..."
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </InputGroup>

          {filteredCompGroups.length === 0 ? (
            <Spinner my={20} size="xl" alignSelf="center" />
          ) : (
            filteredCompGroups.map(
              (compGroup: CompensationGroup, i: number) => (
                <CompensationGroupDetailsTile
                  key={i}
                  conversions={conversions.filter(
                    (conv) => conv.compensationGroupId === compGroup.id
                  )}
                  users={users.filter(
                    (user) => user.compensationGroupId === compGroup.id
                  )}
                  clients={clients}
                  compGroup={compGroup}
                  selectCompGroup={setEditingGroup}
                  deleteCompGroup={deleteCompGroup}
                />
              )
            )
          )}

          <Button
            colorScheme="blue"
            w="full"
            onClick={() => setCreateMode(true)}
          >
            Create New Group
          </Button>
        </React.Fragment>
      )}
    </Flex>
  );
};

export default CompensationGroupWidget;
