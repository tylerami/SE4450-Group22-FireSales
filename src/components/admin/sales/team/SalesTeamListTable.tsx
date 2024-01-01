import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Text,
  Circle,
  Flex,
  useBreakpointValue,
  useDisclosure,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import { Icon } from "@chakra-ui/react";
import { User } from "models/User";
import {
  Conversion,
  averageBetSize,
  averageCommission,
  totalCommission,
  totalGrossProfit,
} from "models/Conversion";
import { Payout } from "models/Payout";
import { formatMoney } from "models/utils/Money";
import { ConversionStatus } from "models/enums/ConversionStatus";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { CompensationGroup } from "models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { DependencyInjection } from "models/utils/DependencyInjection";

export type UserOrAssignmentCode = {
  user?: User;
  assignmentCode?: string;
};

type Props = {
  filteredConversions: Conversion[];
  currentPageUsersAndCodes: UserOrAssignmentCode[];
  filteredPayouts: Payout[];
  selectUser: (user: User) => void;
  compensationGroups: CompensationGroup[];
};

const SalesTeamListTable = ({
  filteredConversions,
  currentPageUsersAndCodes,
  filteredPayouts,
  selectUser,
  compensationGroups,
}: Props) => {
  // Compensation group selection for codes
  const [assignmentCodeCompGroupIds, setAssignmentCodeCompGroupIds] = useState<
    Record<string, string | null>
  >({});

  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  useEffect(() => {
    const fetchAssignmentCodeCompGroupIds = async () => {
      const codeCompGroupIds =
        await compGroupService.getAllAssignmentCodeCompGroupIds();
      setAssignmentCodeCompGroupIds(codeCompGroupIds);
    };

    fetchAssignmentCodeCompGroupIds();
  }, [compGroupService]);

  const getAssignmentCodeCompGroupId = (code: string): string => {
    return assignmentCodeCompGroupIds[code] ?? "UNASSIGNED";
  };

  const setAssignmentCodeCompGroupId = (
    code: string,
    compGroupId: string | null
  ) => {
    setAssignmentCodeCompGroupIds({
      ...assignmentCodeCompGroupIds,
      [code]: compGroupId,
    });
    compGroupService.setAssignmentCodeCompGroupId(code, compGroupId);
  };

  const [selectedAssignmentCode, setSelectedAssignmentCode] = useState<
    string | null
  >(null);

  const openAssignmentCodeCompGroupModel = (assignmentCode: string) => {
    setSelectedAssignmentCode(assignmentCode);
    onOpenCodeAssignmentModal();
  };

  const closeAssignmentCodeCompGroupModel = () => {
    setSelectedAssignmentCode(null);
    onCloseCodeAssignmentModal();
  };

  const {
    isOpen: isOpenCodeAssignmentModal,
    onOpen: onOpenCodeAssignmentModal,
    onClose: onCloseCodeAssignmentModal,
  } = useDisclosure();

  // Table

  const getUserConversions = (uid: string): Conversion[] => {
    return filteredConversions.filter((conv) => conv.userId === uid);
  };

  const getAssignmentCodeConversions = (code: string): Conversion[] => {
    return filteredConversions.filter((conv) => conv.assignmentCode === code);
  };

  const getConversions = (userOrCode: UserOrAssignmentCode): Conversion[] => {
    return userOrCode.user
      ? getUserConversions(userOrCode.user.uid)
      : getAssignmentCodeConversions(userOrCode.assignmentCode!);
  };

  const getAccountBalance = (userOrCode: UserOrAssignmentCode): number => {
    const totalConversions = getConversions(userOrCode);
    if (!userOrCode.user) {
      return totalCommission(totalConversions);
    }

    const totalPayout = filteredPayouts.reduce(
      (total, payout) => total + payout.amount,
      0
    );

    const totalEarnings = totalCommission(totalConversions);
    return totalEarnings - totalPayout;
  };

  const tableColumns: {
    header: string;
    getValue?: (userOrCode: UserOrAssignmentCode) => string;
  }[] = [
    {
      header: "Name",
    },
    {
      header: "Conversions",
      getValue: (userOrCode) => getConversions(userOrCode).length.toString(),
    },
    ...(useBreakpointValue({ base: false, lg: true })
      ? [
          {
            header: "Earnings",
            getValue: (userOrCode) =>
              formatMoney(totalCommission(getConversions(userOrCode))),
          },
        ]
      : []),
    {
      header: "Profit",
      getValue: (userOrCode) =>
        formatMoney(totalGrossProfit(getConversions(userOrCode))),
    },
    {
      header: "Amount Due",
      getValue: (userOrCode) => formatMoney(getAccountBalance(userOrCode)),
    },
    {
      header: "Sales Group",
      getValue: (userOrCode) => {
        if (userOrCode.user) {
          return userOrCode.user.compensationGroupId ?? "UNASSIGNED";
        } else {
          return getAssignmentCodeCompGroupId(userOrCode.assignmentCode!);
        }
      },
    },
    ...(useBreakpointValue({ base: false, "2xl": true })
      ? [
          {
            header: "Avg. Commission",
            getValue: (userOrCode) =>
              formatMoney(averageCommission(getConversions(userOrCode))),
          },
        ]
      : []),
    ...(useBreakpointValue({ base: false, "2xl": true })
      ? [
          {
            header: "Avg. Bet Size",
            getValue: (userOrCode) =>
              formatMoney(averageBetSize(getConversions(userOrCode))),
          },
        ]
      : []),
    {
      header: "Unverified conv.",
      getValue: (userOrCode) =>
        getConversions(userOrCode)
          .filter((conv) => conv.status === ConversionStatus.pending)
          .length.toString(),
    },
  ];

  return (
    <React.Fragment>
      {/* Compensation group selection for codes modal  */}
      <Modal
        isOpen={isOpenCodeAssignmentModal}
        onClose={closeAssignmentCodeCompGroupModel}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Sales Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} justifyContent={"center"} m={6} mb={20}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {getAssignmentCodeCompGroupId(selectedAssignmentCode!) ??
                  "Select a group..."}
              </MenuButton>
              <MenuList>
                {[null, ...compensationGroups].map((compGroup, index) => (
                  <MenuItem
                    key={index}
                    onClick={(e) =>
                      setAssignmentCodeCompGroupId(
                        selectedAssignmentCode!,
                        compGroup?.id ?? null
                      )
                    }
                    value={compGroup?.id ?? undefined}
                  >
                    {compGroup?.id ?? "UNASSIGNED"}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Table */}
      <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
        <Thead>
          <Tr>
            {tableColumns.map((column, index) => (
              <Th textAlign={"center"} key={index}>
                {column.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {currentPageUsersAndCodes.map((userOrCode, index) => (
            <Tr
              backgroundColor={
                userOrCode.user && userOrCode.user?.compensationGroupId == null
                  ? "orange.100"
                  : "white"
              }
              _hover={{ background: "rgba(237, 125, 49, 0.26)" }}
              key={index}
              transition={"all 0.2s ease-in-out"}
              cursor={"pointer"}
              onClick={(e) => {
                if (userOrCode.user) {
                  selectUser(userOrCode.user);
                } else {
                  openAssignmentCodeCompGroupModel(userOrCode.assignmentCode!);
                }
              }}
              height={"5em"}
            >
              <Td maxWidth={"10em"} textAlign="center">
                <Flex justifyContent={"left"}>
                  {userOrCode.user && userOrCode.user.profilePictureSrc ? (
                    <Image
                      borderRadius="full"
                      boxSize="40px"
                      src={userOrCode.user.profilePictureSrc}
                      alt={""}
                      mr={2}
                    />
                  ) : (
                    <Circle size="40px" bg="gray.200" mr="2">
                      <Icon as={FiUser} />
                    </Circle>
                  )}

                  <Text ml={2} textAlign={"left"}>
                    {userOrCode.user?.getFullName() ??
                      `${userOrCode.assignmentCode} (Unregistered)`}
                  </Text>
                </Flex>
              </Td>

              {tableColumns.map(
                (column, index) =>
                  column.getValue && (
                    <Td textAlign={"center"} key={index}>
                      {column.getValue(userOrCode)}
                    </Td>
                  )
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </React.Fragment>
  );
};

export default SalesTeamListTable;
