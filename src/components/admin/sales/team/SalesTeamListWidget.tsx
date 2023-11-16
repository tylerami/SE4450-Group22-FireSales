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
import SalesTeamListTable from "./SalesTeamListTable";

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

  const getUserConversions = (uid: string): Conversion[] => {
    return getFilteredConversions().filter((conv) => conv.userId === uid);
  };

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

  const pageLength = 10;

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
          <Heading minW="30%" as="h1" fontSize={"1.2em"} fontWeight={700}>
            Manage Sales Team
          </Heading>
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
      <SalesTeamListTable
        currentPageUsers={currentPageUsers}
        conversions={getFilteredConversions()}
        selectUser={setSelectedUser}
        payouts={payouts}
        timeframeFilter={timeframeFilter}
      />
    </Flex>
  );
};

export default SalesTeamListWidget;
