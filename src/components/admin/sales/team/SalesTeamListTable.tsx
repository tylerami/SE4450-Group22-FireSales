import React from "react";
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

export type UserOrAssignmentCode = {
  user?: User;
  assignmentCode?: string;
};

type Props = {
  filteredConversions: Conversion[];
  currentPageUsersAndCodes: UserOrAssignmentCode[];
  filteredPayouts: Payout[];
  selectUser: (user: User) => void;
};

const SalesTeamListTable = ({
  filteredConversions,
  currentPageUsersAndCodes,
  filteredPayouts,
  selectUser,
}: Props) => {
  const getUser = (uid: string): User => {
    const user = currentPageUsersAndCodes.find(
      (userOrCode: UserOrAssignmentCode) => userOrCode.user?.uid === uid
    )?.user;
    if (!user) {
      throw new Error(`User with uid ${uid} not found`);
    }
    return user;
  };

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
      getValue: (userOrCode) =>
        userOrCode.user
          ? getUser(userOrCode.user.uid).compensationGroupId ?? "UNASSIGNED"
          : "UNASSIGNED",
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
  );
};

export default SalesTeamListTable;
