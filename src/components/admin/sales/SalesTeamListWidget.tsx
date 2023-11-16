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
import { User } from "../../../models/User";
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
import { ConversionsStatus } from "models/enums/ConversionStatus";

enum SortBy {
  Conversions = "Conversions",
  Earnings = "Earnings",
  ProfitGenerated = "Profit Generated",
  AvgCommission = "Avg. Commission",
  UnverifiedConversions = "Unverified Conversions",
}

enum SortDirection {
  Ascending = "Ascending",
  Descending = "Descending",
}

type Props = {
  setSelectedUser: (user: User) => void;
  conversions: Conversion[];
  users: User[];
  payouts: Payout[];
  compGroups: CompensationGroup[];
};

const SalesTeamListWidget = ({
  setSelectedUser,
  conversions,
  compGroups,
  users,
  payouts,
}: Props) => {
  // Filters
  const [timeframeFilter, setTimeframeFilter] = useState<Timeframe>(
    Timeframe.lastMonth
  );

  const [userSearch, setUserSearch] = useState<string>("");

  const [compGroupFilter, setCompGroupFilter] =
    useState<CompensationGroup | null>(null);

  // Sorting
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.UnverifiedConversions);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Descending
  );

  const getFilteredConversions = (): Conversion[] => {
    let filteredConversions: Conversion[] = Object.assign([], conversions);
    if (compGroupFilter) {
      filteredConversions = filteredConversions.filter(
        (conv) => conv.compensationGroupId === compGroupFilter.id
      );
    }
    if (timeframeFilter) {
      filteredConversions = filterConversionsByTimeframe(
        filteredConversions,
        timeframeFilter
      );
    }
    return filteredConversions;
  };

  const getFilteredAndSortedUsers = () => {
    let filteredUsers: User[] = Object.assign([], users);
    if (compGroupFilter) {
      filteredUsers = filteredUsers.filter(
        (user) => user.compensationGroupId === compGroupFilter.id
      );
    }

    switch (sortBy) {
      case SortBy.Conversions:
        filteredUsers.sort((a, b) => {
          const aConversions = getUserConversions(a.uid);
          const bConversions = getUserConversions(b.uid);
          return (
            (sortDirection === SortDirection.Ascending ? 1 : -1) *
            (aConversions.length - bConversions.length)
          );
        });
        break;
      case SortBy.Earnings:
        filteredUsers.sort((a, b) => {
          const aEarnings = totalCommission(getUserConversions(a.uid));
          const bEarnings = totalCommission(getUserConversions(b.uid));
          return (
            (sortDirection === SortDirection.Ascending ? 1 : -1) *
            (aEarnings - bEarnings)
          );
        });
        break;
      case SortBy.ProfitGenerated:
        filteredUsers.sort((a, b) => {
          const aProfit = totalGrossProfit(getUserConversions(a.uid));
          const bProfit = totalGrossProfit(getUserConversions(b.uid));
          return (
            (sortDirection === SortDirection.Ascending ? 1 : -1) *
            (aProfit - bProfit)
          );
        });
        break;
      case SortBy.AvgCommission:
        filteredUsers.sort((a, b) => {
          const aAvgCommission = averageCommission(getUserConversions(a.uid));
          const bAvgCommission = averageCommission(getUserConversions(b.uid));
          return (
            (sortDirection === SortDirection.Ascending ? 1 : -1) *
            (aAvgCommission - bAvgCommission)
          );
        });
        break;
      case SortBy.UnverifiedConversions:
        break;
    }

    if (userSearch.trim() !== "") {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.getFullName().toLowerCase().indexOf(userSearch.toLowerCase()) >
          -1
      );
    }

    return filteredUsers;
  };

  const getUser = (uid: string): User => {
    const user = users.find((user) => user.uid === uid);
    if (!user) {
      throw new Error(`User with uid ${uid} not found`);
    }
    return user;
  };

  const getUserConversions = (uid: string): Conversion[] => {
    return getFilteredConversions().filter((conv) => conv.userId === uid);
  };

  const getAccountBalance = (uid: string): number => {
    const filteredPayouts: Payout[] = payouts.filter(
      (payout) =>
        payout.userId === uid &&
        payout.dateOccured.getTime() >
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
          .filter((conv) => conv.status === ConversionsStatus.pending)
          .length.toString(),
    },
  ];

  const timeframes: Timeframe[] = Object.values(Timeframe).filter(
    (value): value is Timeframe => typeof value === "number"
  );

  const filterDropdowns: FilterDefinition<
    Client | CompensationGroup | Timeframe | ReferralLinkType
  >[] = [
    {
      options: [null, ...compGroups],
      onChange: (value) => setCompGroupFilter(value as CompensationGroup),
      value: compGroupFilter,
      refresh: getFilteredConversions,
      label: (value) => {
        if (value == null) return "All Comp. Groups";
        return (value as CompensationGroup).id;
      },
    },
    {
      options: timeframes,
      onChange: (value) => setTimeframeFilter(value as Timeframe),
      value: timeframeFilter,
      refresh: getFilteredConversions,
      label: (value) => getTimeframeLabel(value as Timeframe),
    },
  ];

  const sortByDropdowns: FilterDefinition<SortBy | SortDirection>[] = [
    {
      options: Object.values(SortBy),
      onChange: (value) => setSortBy(value as SortBy),
      value: sortBy,
      refresh: getFilteredConversions,
      label: (value) => value!.toString(),
    },

    {
      options: Object.values(SortDirection),
      onChange: (value) => setSortDirection(value as SortDirection),
      value: sortDirection,
      refresh: getFilteredConversions,
      label: (value) => value!.toString(),
    },
  ];

  const filteredUsers = getFilteredAndSortedUsers();

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);

  const pageLength = 20;

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageLength));

  const nextPage = () => {
    if (pageIndex === pageCount - 1) return;
    setPageIndex((prev) => prev + 1);
  };

  const prevPage = () => {
    if (pageIndex === 0) return;
    setPageIndex((prev) => prev - 1);
  };

  const currentPageUsers: User[] = filteredUsers.slice(
    pageIndex * pageLength,
    (pageIndex + 1) * pageLength
  );

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      minWidth={"35em"}
      width={"95%"}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Flex
        justifyContent={"start"}
        gap={6}
        alignItems={"start"}
        direction={"column"}
      >
        <Flex gap={4} w="100%" alignItems={"center"}>
          {" "}
          <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
            Manage Sales Team
          </Heading>
          <Box w={10} />
          <Spacer />
          <InputGroup w="full" maxW="50%">
            <InputLeftElement>
              <Icon _hover={{ color: "#434343" }} as={FiSearch} />
            </InputLeftElement>
            <Input
              focusBorderColor="#ED7D31"
              variant="filled"
              placeholder="Search..."
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </InputGroup>
          <Spacer />
          <React.Fragment>
            <IconButton
              isDisabled={pageIndex === 0}
              onClick={prevPage}
              icon={<ChevronLeftIcon />}
              aria-label={""}
            />
            <Text>
              Page {pageIndex + 1} / {pageCount}
            </Text>
            <IconButton
              isDisabled={pageIndex === pageCount - 1}
              onClick={nextPage}
              icon={<ChevronRightIcon />}
              aria-label={""}
            />
          </React.Fragment>
        </Flex>

        <Flex
          gap={4}
          alignItems={"left"}
          width={"100%"}
          direction={{ base: "column", "2xl": "row" }}
        >
          <Flex gap={4} flex={1} alignItems={"center"}>
            <Heading size="xs" fontWeight={400}>
              Filter By:
            </Heading>
            {filterDropdowns.map((filter, i) => (
              <Filter key={i} filter={filter} />
            ))}
          </Flex>
          <Flex
            gap={4}
            flex={1}
            alignItems={"center"}
            justifyContent={{ base: "start", "2xl": "end" }}
          >
            <Heading minW="4em" size="xs" fontWeight={400}>
              Sort By:
            </Heading>
            {sortByDropdowns.map((filter, i) => (
              <Filter key={i} filter={filter} />
            ))}
          </Flex>
        </Flex>
      </Flex>

      <Box h={10}></Box>
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
              onClick={(e) => setSelectedUser({} as User)}
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
    </Flex>
  );
};

export default SalesTeamListWidget;
