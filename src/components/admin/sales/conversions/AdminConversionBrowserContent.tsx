import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Heading,
  Spacer,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Conversion, filterConversionsByTimeframe } from "models/Conversion";
import { Timeframe, getTimeframeLabel } from "models/enums/Timeframe";
import { Client } from "models/Client";
import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "models/enums/ReferralLinkType";
import { CompensationGroup } from "models/CompensationGroup";
import Filter, { FilterDefinition } from "components/utils/Filter";
import { formatMoney } from "utils/Money";
import {
  ConversionStatus,
  getConversionStatusLabel,
} from "models/enums/ConversionStatus";
import { formatDateString } from "utils/Date";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { DependencyInjection } from "@utils/DependencyInjection";

type Props = {
  conversions: Conversion[];
  clients: Client[];
  compGroup: CompensationGroup | null;
  selectConversion: (conversion: Conversion) => void;
};

const AdminConversionBrowserContent = ({
  conversions,
  clients,
  selectConversion,
  compGroup,
}: Props) => {
  const tableColumns: {
    label: string;
    getValue: (conv: Conversion) => string;
  }[] = [
    ...(useBreakpointValue({ base: false, "2xl": true })
      ? [
          {
            label: "ID",
            getValue: (conv: Conversion) => conv.id,
          },
        ]
      : []),
    {
      label: "Date",
      getValue: (conv: Conversion) => formatDateString(conv.dateOccurred),
    },
    {
      label: "Affilate Link",
      getValue: (conv: Conversion) => conv.affiliateLink.description(),
    },
    {
      label: "Bet size",
      getValue: (conv: Conversion) => formatMoney(conv.amount),
    },
    {
      label: "Customer Name",
      getValue: (conv: Conversion) => conv.customer.fullName,
    },
    {
      label: "Commission",
      getValue: (conv: Conversion) =>
        formatMoney(conv.affiliateLink.commission),
    },
    ...(useBreakpointValue({ base: false, xl: true })
      ? [
          {
            label: "CPA",
            getValue: (conv: Conversion) => formatMoney(conv.affiliateLink.cpa),
          },
        ]
      : []),
    {
      label: "Status",
      getValue: (conv: Conversion) => getConversionStatusLabel(conv.status),
    },
  ];

  const [timeframeFilter, setTimeframeFilter] = useState<Timeframe | null>(
    null
  );
  const [clientFilter, setClientFilter] = useState<Client | null>(null);
  const [referralTypeFilter, setReferralTypeFilter] =
    useState<ReferralLinkType | null>(null);
  const [convStatusFilter, setConvStatusFilter] =
    useState<ConversionStatus | null>(null);

  enum SortBy {
    Date = "Date",
    BetSize = "Bet Size",
    Commission = "Commission",
    CPA = "CPA",
  }

  enum SortDirection {
    Ascending = "Ascending",
    Descending = "Descending",
  }

  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Date);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Descending
  );

  const timeframes: Timeframe[] = Object.values(Timeframe).filter(
    (t) => typeof t !== "string"
  ) as Timeframe[];

  const referralTypes: ReferralLinkType[] = Object.values(ReferralLinkType);
  referralTypes.sort((a, b) => b.length - a.length);

  const conversionStatuses: ConversionStatus[] =
    Object.values(ConversionStatus);

  const filterDropdowns: FilterDefinition<
    Client | Timeframe | ConversionStatus | ReferralLinkType
  >[] = [
    {
      options: [null, ...clients],
      onChange: (value) => setClientFilter(value as Client | null),
      value: clientFilter,
      label: (value) => {
        if (value === null) return "All Comp. Groups";
        return (value as Client).name;
      },
    },
    {
      options: referralTypes,
      onChange: (value) => setReferralTypeFilter(value as ReferralLinkType),
      value: referralTypeFilter,
      label: (value) => getReferralLinkTypeLabel(value as ReferralLinkType),
    },
    {
      options: [null, ...conversionStatuses],
      onChange: (value) => setConvStatusFilter(value as ConversionStatus),
      value: convStatusFilter,
      label: (value) => {
        if (value === null) return "Any Status";
        return getConversionStatusLabel(value as ConversionStatus);
      },
    },
    {
      options: timeframes,
      onChange: (value) => setTimeframeFilter(value as Timeframe),
      value: timeframeFilter,
      label: (value) => {
        if (value === null) return "All Time";
        return getTimeframeLabel(value as Timeframe);
      },
    },
  ];

  const sortByDropdowns: FilterDefinition<SortBy | SortDirection>[] = [
    {
      options: Object.values(SortBy),
      onChange: (value) => setSortBy(value as SortBy),
      value: sortBy,
      label: (value) => value!.toString(),
    },

    {
      options: Object.values(SortDirection),
      onChange: (value) => setSortDirection(value as SortDirection),
      value: sortDirection,
      label: (value) => value!.toString(),
    },
  ];

  const filterAndSortConversions = (): Conversion[] => {
    let filteredConversions: Conversion[] = Object.assign([], conversions);

    if (clientFilter !== null) {
      filteredConversions = filteredConversions.filter(
        (conv) => conv.affiliateLink.clientId === clientFilter.id
      );
    }

    if (referralTypeFilter !== null) {
      filteredConversions = filteredConversions.filter(
        (conv) => conv.affiliateLink.type === referralTypeFilter
      );
    }

    if (convStatusFilter !== null) {
      filteredConversions = filteredConversions.filter(
        (conv) => conv.status === convStatusFilter
      );
    }

    if (timeframeFilter !== null) {
      filteredConversions = filterConversionsByTimeframe(
        filteredConversions,
        timeframeFilter
      );
    }

    switch (sortBy) {
      case SortBy.BetSize:
        if (sortDirection === SortDirection.Descending) {
          filteredConversions.sort((a, b) => b.amount - a.amount);
        } else {
          filteredConversions.sort((a, b) => a.amount - b.amount);
        }

        break;
      case SortBy.Commission:
        if (sortDirection === SortDirection.Descending) {
          filteredConversions.sort(
            (a, b) => b.affiliateLink.commission - a.affiliateLink.commission
          );
        } else {
          filteredConversions.sort(
            (a, b) => a.affiliateLink.commission - b.affiliateLink.commission
          );
        }
        break;
      case SortBy.CPA:
        if (sortDirection === SortDirection.Descending) {
          filteredConversions.sort((a, b) => b.affiliateLink.cpa - a.amount);
        } else {
          filteredConversions.sort((a, b) => a.affiliateLink.cpa - b.amount);
        }
        break;
      case SortBy.Date:
        if (sortDirection === SortDirection.Descending) {
          filteredConversions.sort(
            (a, b) => b.dateOccurred.getTime() - a.dateOccurred.getTime()
          );
        } else {
          filteredConversions.sort(
            (a, b) => a.dateOccurred.getTime() - b.dateOccurred.getTime()
          );
        }
        break;
    }

    return filteredConversions;
  };

  const filteredConversions = filterAndSortConversions();

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);

  const pageLength = 20;

  const pageCount = Math.max(
    1,
    Math.ceil(filteredConversions.length / pageLength)
  );

  const nextPage = () => {
    if (pageIndex === pageCount - 1) return;
    setPageIndex((prev) => prev + 1);
  };

  const prevPage = () => {
    if (pageIndex === 0) return;
    setPageIndex((prev) => prev - 1);
  };

  const currentPageConversions: Conversion[] = filteredConversions.slice(
    pageIndex * pageLength,
    (pageIndex + 1) * pageLength
  );

  return (
    <React.Fragment>
      <Flex alignItems={"center"} gap={4} justifyContent={"start"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          Conversion History
        </Heading>
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

      <Table size="sm">
        <Thead>
          <Tr>
            {tableColumns.map((property, i) => {
              return (
                <Th key={i} textAlign={"center"}>
                  {property.label}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {currentPageConversions.map((sale, i) => (
            <Tr
              key={i}
              cursor={"pointer"}
              onClick={() => {
                selectConversion(sale);
              }}
              _hover={{ background: "rgba(237, 125, 49, 0.26)" }}
            >
              {tableColumns.map((property, i) => {
                return (
                  <Td key={i} textAlign={"center"}>
                    {property.getValue(sale)}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </React.Fragment>
  );
};

export default AdminConversionBrowserContent;
