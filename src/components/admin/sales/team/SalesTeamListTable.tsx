import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Box,
  Text,
  Circle,
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Spacer,
  useBreakpointValue,
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
  Button,
} from "@chakra-ui/react";
import { FiSearch, FiUser } from "react-icons/fi";
import { Icon, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { User } from "../../../../models/User";
import {
  Conversion,
  averageBetSize,
  averageCommission,
  filterConversionsByTimeframe,
  totalCommission,
  totalGrossProfit,
} from "models/Conversion";
import { Payout } from "models/Payout";
import {
  Timeframe,
  getIntervalStart,
  getTimeframeLabel,
} from "models/enums/Timeframe";
import { Client } from "models/Client";
import { ReferralLinkType } from "models/enums/ReferralLinkType";
import { CompensationGroup } from "models/CompensationGroup";
import Filter, { FilterDefinition } from "components/utils/Filter";
import { formatMoney } from "utils/Money";
import { ConversionStatus } from "models/enums/ConversionStatus";

type Props = {
  conversions: Conversion[];
  currentPageUsers: User[];
  payouts: Payout[];
  timeframeFilter: Timeframe;
  selectUser: (user: User) => void;
};

const SalesTeamListTable = ({
  conversions,
  currentPageUsers,
  payouts,
  timeframeFilter,
  selectUser,
}: Props) => {
  const getUser = (uid: string): User => {
    const user = currentPageUsers.find((user) => user.uid === uid);
    if (!user) {
      throw new Error(`User with uid ${uid} not found`);
    }
    return user;
  };

  const getUserConversions = (uid: string): Conversion[] => {
    return conversions.filter((conv) => conv.userId === uid);
  };

  const getAccountBalance = (uid: string): number => {
    const filteredPayouts: Payout[] = payouts.filter(
      (payout) =>
        payout.userId === uid &&
        payout.dateOccurred.getTime() >
          getIntervalStart(timeframeFilter).getTime()
    );

    const totalPayout = filteredPayouts.reduce(
      (total, payout) => total + payout.amount,
      0
    );

    const totalEarnings = totalCommission(getUserConversions(uid));
    return totalEarnings - totalPayout;
  };

  const tableColumns: {
    header: string;
    getValue?: (uid: string) => string;
  }[] = [
    {
      header: "Name",
    },
    {
      header: "Conversions",
      getValue: (uid) => getUserConversions(uid).length.toString(),
    },
    ...(useBreakpointValue({ base: false, lg: true })
      ? [
          {
            header: "Earnings",
            getValue: (uid) =>
              formatMoney(totalCommission(getUserConversions(uid))),
          },
        ]
      : []),
    {
      header: "Profit",
      getValue: (uid) => formatMoney(totalGrossProfit(getUserConversions(uid))),
    },
    {
      header: "Amount Due",
      getValue: (uid) => formatMoney(getAccountBalance(uid)),
    },
    {
      header: "Sales Group",
      getValue: (uid) => getUser(uid).compensationGroupId ?? "N/A",
    },
    ...(useBreakpointValue({ base: false, "2xl": true })
      ? [
          {
            header: "Avg. Commission",
            getValue: (uid) =>
              formatMoney(averageCommission(getUserConversions(uid))),
          },
        ]
      : []),
    ...(useBreakpointValue({ base: false, "2xl": true })
      ? [
          {
            header: "Avg. Bet Size",
            getValue: (uid) =>
              formatMoney(averageBetSize(getUserConversions(uid))),
          },
        ]
      : []),
    {
      header: "Unverified conv.",
      getValue: (uid) =>
        getUserConversions(uid)
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
        {currentPageUsers.map((user, index) => (
          <Tr
            _hover={{ background: "rgba(237, 125, 49, 0.26)" }}
            textAlign={"center"}
            key={index}
            transition={"all 0.2s ease-in-out"}
            cursor={"pointer"}
            onClick={(e) => selectUser(user)}
            height={"5em"}
          >
            <Td maxWidth={"10em"} textAlign="center">
              <Flex justifyContent={"center"}>
                {user.profilePictureSrc ? (
                  <Image
                    borderRadius="full"
                    boxSize="40px"
                    src={user.profilePictureSrc}
                    alt={""}
                    mr={2}
                  />
                ) : (
                  <Circle size="40px" bg="gray.200" mr="2">
                    <Icon as={FiUser} />
                  </Circle>
                )}

                <Text ml={2} textAlign={"left"}>
                  {user.getFullName()}
                </Text>
              </Flex>
            </Td>

            {tableColumns.map(
              (column, index) =>
                column.getValue && (
                  <Td textAlign={"center"} key={index}>
                    {column.getValue(user.uid)}
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
