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
import { User } from "models/User";
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
import SalesTeamListTable, { UserOrAssignmentCode } from "./SalesTeamListTable";
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

  const [showAdmins, setShowAdmins] = useState<boolean>(false);
  const toggleShowAdmins = () => {
    setShowAdmins((prev) => !prev);
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

  const getFilteredSortedUsersAndCodes = (): UserOrAssignmentCode[] => {
    let filteredUsers: User[] = Object.assign([], users);

    // get all assignment codes for conversions without a userId
    const unassignedConversionCodes = new Set<string>();
    for (const conv of conversions.filter((conv) => !conv.userId)) {
      if (!conv.assignmentCode) continue;
      unassignedConversionCodes.add(conv.assignmentCode);
    }

    let filteredUsersAndCodes: UserOrAssignmentCode[] = [
      ...filteredUsers.map((user) => ({
        user,
      })),
      ...Array.from(unassignedConversionCodes.values()).map((code: string) => ({
        assignmentCode: code,
      })),
    ];

    if (compGroupFilter) {
      filteredUsersAndCodes = filteredUsersAndCodes.filter(
        (userOrCode) =>
          userOrCode.user &&
          userOrCode.user.compensationGroupId === compGroupFilter.id
      );
    }

    switch (sortBy) {
      case SortBy.Conversions:
        filteredUsersAndCodes.sort((a, b) => {
          const aConversions = getConversions(a);
          const bConversions = getConversions(b);
          return (
            (sortDirection === SortDirection.Ascending ? 1 : -1) *
            (aConversions.length - bConversions.length)
          );
        });
        break;
      case SortBy.Earnings:
        filteredUsersAndCodes.sort((a, b) => {
          const aEarnings = totalCommission(getConversions(a));
          const bEarnings = totalCommission(getConversions(b));
          return (
            (sortDirection === SortDirection.Ascending ? 1 : -1) *
            (aEarnings - bEarnings)
          );
        });
        break;
      case SortBy.ProfitGenerated:
        filteredUsersAndCodes.sort((a, b) => {
          const aProfit = totalGrossProfit(getConversions(a));
          const bProfit = totalGrossProfit(getConversions(b));
          return (
            (sortDirection === SortDirection.Ascending ? 1 : -1) *
            (aProfit - bProfit)
          );
        });
        break;
      case SortBy.AvgCommission:
        filteredUsersAndCodes.sort((a, b) => {
          const aAvgCommission = averageCommission(getConversions(a));
          const bAvgCommission = averageCommission(getConversions(b));
          return (
            (sortDirection === SortDirection.Ascending ? 1 : -1) *
            (aAvgCommission - bAvgCommission)
          );
        });
        break;
      case SortBy.UnverifiedConversions:
        filteredUsersAndCodes.sort((a, b) => {
          const aUnverifiedConversions = getConversions(a).filter(
            (conv) => conv.status === ConversionStatus.pending
          );
          const bUnverifiedConversions = getConversions(b).filter(
            (conv) => conv.status === ConversionStatus.pending
          );
          return (
            (sortDirection === SortDirection.Ascending ? 1 : -1) *
            (aUnverifiedConversions.length - bUnverifiedConversions.length)
          );
        });
        break;
    }

    const isUnassigned = (userOrCode: UserOrAssignmentCode): boolean => {
      return userOrCode.user
        ? userOrCode.user.compensationGroupId === null
        : true;
    };

    // bring all users without a compensationGroupId to the top. order remains untouched otherwise
    if (showUnassignedUsers) {
      filteredUsersAndCodes.sort((a, b) => {
        if (isUnassigned(a) && isUnassigned(b)) {
          return 0;
        } else if (isUnassigned(a)) {
          return -1;
        } else if (isUnassigned(b)) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      filteredUsersAndCodes = filteredUsersAndCodes.filter(
        (userOrCode) => !isUnassigned(userOrCode)
      );
    }

    if (userSearch.trim() !== "") {
      filteredUsersAndCodes = filteredUsersAndCodes.filter(
        (userOrCode) =>
          userOrCode.user &&
          userOrCode.user
            .getFullName()
            .toLowerCase()
            .indexOf(userSearch.toLowerCase()) > -1
      );
    }

    if (!showAdmins) {
      filteredUsersAndCodes = filteredUsersAndCodes.filter(
        (userOrCode) => !userOrCode.user || !userOrCode.user.isAdmin()
      );
    }

    // move users to before codes:
    filteredUsersAndCodes.sort((a, b) => {
      if (a.user && b.assignmentCode) {
        return -1;
      } else if (a.assignmentCode && b.user) {
        return 1;
      } else {
        return 0;
      }
    });

    return filteredUsersAndCodes;
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

  const getAssignmentCodeConversions = (code: string): Conversion[] => {
    return getFilteredConversions().filter(
      (conv) => conv.assignmentCode === code
    );
  };

  const getConversions = (userOrCode: UserOrAssignmentCode): Conversion[] => {
    return userOrCode.user
      ? getUserConversions(userOrCode.user.uid)
      : getAssignmentCodeConversions(userOrCode.assignmentCode!);
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

  const filteredUsersAndCodes = getFilteredSortedUsersAndCodes();

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);

  const pageLength = 10;

  const nextPage = () => {
    if (pageIndex === pageCount - 1) return;
    setPageIndex((prev) => prev + 1);
  };

  const prevPage = () => {
    if (pageIndex === 0) return;
    setPageIndex((prev) => prev - 1);
  };

  const pageCount = Math.max(
    1,
    Math.ceil(filteredUsersAndCodes.length / pageLength)
  );

  const currentPageUsersAndCodes: UserOrAssignmentCode[] =
    filteredUsersAndCodes.slice(
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
        <Flex alignItems={"center"} gap={2}>
          <Heading minW="4em" size="xs" fontWeight={400}>
            Unassigned Users:
          </Heading>
          <Switch
            isChecked={showUnassignedUsers}
            onChange={toggleUnassignedUsers}
          />
          <Box w={4} />
          <Heading minW="4em" size="xs" fontWeight={400}>
            Show Admins:
          </Heading>
          <Switch isChecked={showAdmins} onChange={toggleShowAdmins} />
        </Flex>
      </Flex>

      <Box h={10}></Box>
      <SalesTeamListTable
        currentPageUsersAndCodes={currentPageUsersAndCodes}
        filteredConversions={getFilteredConversions()}
        selectUser={setSelectedUser}
        filteredPayouts={getFilteredPayouts()}
        compensationGroups={compGroups}
      />

      {filteredUsersAndCodes.length > 0 ? (
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
