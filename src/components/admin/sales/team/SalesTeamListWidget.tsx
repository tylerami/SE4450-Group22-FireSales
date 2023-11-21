import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Spacer,
  Switch,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { Icon, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { User } from "../../../../models/User";
import {
  Conversion,
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
import { ConversionStatus } from "models/enums/ConversionStatus";
import SalesTeamListTable from "./SalesTeamListTable";
import SalesTeamTotalsTable from "./SalesTeamTotalsTable";

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

  const [showUnassignedUsers, setShowUnassignedUsers] = useState<boolean>(true);
  const toggleUnassignedUsers = () => {
    setShowUnassignedUsers((prev) => !prev);
  };

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
        filteredUsers.sort((a, b) => {
          const aUnverifiedConversions = getUserConversions(a.uid).filter(
            (conv) => conv.status === ConversionStatus.pending
          );
          const bUnverifiedConversions = getUserConversions(b.uid).filter(
            (conv) => conv.status === ConversionStatus.pending
          );
          return (
            (sortDirection === SortDirection.Ascending ? 1 : -1) *
            (aUnverifiedConversions.length - bUnverifiedConversions.length)
          );
        });
        break;
    }

    // bring all users without a compensationGroupId to the top. order remains untouched otherwise
    if (showUnassignedUsers) {
      filteredUsers.sort((a, b) => {
        if (a.compensationGroupId === null && b.compensationGroupId === null) {
          return 0;
        } else if (a.compensationGroupId === null) {
          return -1;
        } else if (b.compensationGroupId === null) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      filteredUsers = filteredUsers.filter(
        (user) => user.compensationGroupId !== null
      );
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

  const getFilteredPayouts = (): Payout[] => {
    return payouts.filter(
      (payout) =>
        payout.dateOccurred.getTime() >
        getIntervalStart(timeframeFilter).getTime()
    );
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
          <InputGroup w="full" maxW="40%">
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
            <Heading minW="4em" size="xs" fontWeight={400}>
              Unassigned Users:
            </Heading>
            <Switch
              isChecked={showUnassignedUsers}
              onChange={toggleUnassignedUsers}
            />
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
        filteredConversions={getFilteredConversions()}
        selectUser={setSelectedUser}
        filteredPayouts={getFilteredPayouts()}
      />

      {filteredUsers.length > 0 ? (
        <React.Fragment>
          <Heading mt={4} minW="30%" as="h1" size="sm" fontWeight={700}>
            Totals
          </Heading>
          <SalesTeamTotalsTable
            filteredConversions={getFilteredConversions()}
            filteredPayouts={getFilteredPayouts()}
          />
        </React.Fragment>
      ) : (
        <Text my={10} alignSelf={"center"}>
          No Users Found
        </Text>
      )}
    </Flex>
  );
};

export default SalesTeamListWidget;
