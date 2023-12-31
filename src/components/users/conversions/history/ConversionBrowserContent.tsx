import React, { useState } from "react";
import {
  Flex,
  Heading,
  IconButton,
  Spacer,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Conversion, filterConversionsByTimeframe } from "models/Conversion";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { formatDateString } from "models/utils/Date";
import { Timeframe, getTimeframeLabel } from "models/enums/Timeframe";
import { CompensationGroup } from "models/CompensationGroup";
import { Client } from "models/Client";
import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "models/enums/ReferralLinkType";
import Filter, { FilterDefinition } from "components/utils/Filter";
import {
  ConversionStatus,
  getConversionStatusLabel,
} from "models/enums/ConversionStatus";

enum SortBy {
  BetSize = "Bet Size",
  Date = "Date",
  Commission = "Commission",
}

enum SortDirection {
  Ascending = "Ascending",
  Descending = "Descending",
}

type Props = {
  conversions: Conversion[];
  clients: Client[];
  compGroup: CompensationGroup | null;
  selectConversion: (conversion: Conversion) => void;
};

const ConversionBrowserContent = ({
  conversions,
  clients,
  selectConversion,
  compGroup,
}: Props) => {
  const tableColumns: {
    label: string;
    getValue: (conv: Conversion) => string | number;
  }[] = [
    {
      label: "Date",
      getValue: (conv: Conversion) => formatDateString(conv.dateOccurred),
    },
    {
      label: "Affilate Link",
      getValue: (conv: Conversion) => conv.affiliateLink.description,
    },
    {
      label: "Bet size",
      getValue: (conv: Conversion) => conv.amount,
    },
    {
      label: "Customer Name",
      getValue: (conv: Conversion) => conv.customer.fullName,
    },
    {
      label: "Commission",
      getValue: (conv: Conversion) => conv.affiliateLink.commission,
    },
    {
      label: "Status",
      getValue: (conv: Conversion) => getConversionStatusLabel(conv.status),
    },
  ];

  const [timeframeFilter, setTimeframeFilter] = useState<Timeframe>(
    Timeframe.lastYear
  );

  const [clientFilter, setClientFilter] = useState<Client | null>(null);
  const [referralTypeFilter, setReferralTypeFilter] =
    useState<ReferralLinkType | null>(null);

  const referralTypes: ReferralLinkType[] = Object.values(ReferralLinkType);
  referralTypes.sort((a, b) => b.length - a.length);

  const timeframes: Timeframe[] = Object.values(Timeframe).filter(
    (t) => typeof t !== "string"
  ) as Timeframe[];

  // Sorting
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Date);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Descending
  );

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

  // Filtering

  const filterDropdowns: FilterDefinition<
    Client | Timeframe | ReferralLinkType
  >[] = [
    {
      options: timeframes,
      onChange: (value) => setTimeframeFilter(value as Timeframe),
      value: timeframeFilter,
      label: (value) => getTimeframeLabel(value as Timeframe),
    },
    {
      options: [null, ...clients],
      onChange: (value) => setClientFilter(value as Client | null),
      value: clientFilter,
      label: (value: any) => value?.name ?? "All Clients",
    },
    {
      options: [null, ...referralTypes],
      onChange: (value) =>
        setReferralTypeFilter(value as ReferralLinkType | null),
      value: referralTypeFilter,
      label: (value) =>
        getReferralLinkTypeLabel(value as ReferralLinkType | null),
    },
  ];

  const filterAndSortConversions = (): Conversion[] => {
    let filteredConversions: Conversion[] = Object.assign([], conversions);

    if (timeframeFilter !== null) {
      filteredConversions = filterConversionsByTimeframe(
        filteredConversions,
        timeframeFilter
      );
    }
    if (clientFilter) {
      filteredConversions = filteredConversions.filter(
        (conv) => conv.affiliateLink.clientId === clientFilter.id
      );
    }
    if (referralTypeFilter) {
      filteredConversions = filteredConversions.filter(
        (conv) => conv.affiliateLink.type === referralTypeFilter
      );
    }

    // sorting, incorportate sortDirection
    switch (sortBy) {
      case SortBy.BetSize:
        if (sortDirection === SortDirection.Ascending) {
          filteredConversions.sort((a, b) => a.amount - b.amount);
        } else {
          filteredConversions.sort((a, b) => b.amount - a.amount);
        }
        break;
      case SortBy.Commission:
        if (sortDirection === SortDirection.Ascending) {
          filteredConversions.sort(
            (a, b) => a.affiliateLink.commission - b.affiliateLink.commission
          );
        } else {
          filteredConversions.sort(
            (a, b) => b.affiliateLink.commission - a.affiliateLink.commission
          );
        }
        break;
      case SortBy.Date:
        if (sortDirection === SortDirection.Ascending) {
          filteredConversions.sort(
            (a, b) => a.dateOccurred.getTime() - b.dateOccurred.getTime()
          );
        } else {
          filteredConversions.sort(
            (a, b) => b.dateOccurred.getTime() - a.dateOccurred.getTime()
          );
        }
        break;
    }

    return filteredConversions;
  };

  // Pagination
  const filteredConversions = filterAndSortConversions();

  const [pageIndex, setPageIndex] = useState<number>(0);

  const pageLength = 10;

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

  const currentPageConversions = filteredConversions.slice(
    pageIndex * pageLength,
    pageIndex * pageLength + pageLength
  );

  if (!compGroup) {
    return <Spinner />;
  }

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
        alignItems={"center"}
        flexDirection={{ base: "column", lg: "row" }}
        gap={4}
        justifyContent={"space-between"}
        w="100%"
      >
        <Flex gap={4} alignItems={"center"}>
          <Heading size="xs" fontWeight={400}>
            Filter By:
          </Heading>
          {filterDropdowns.map((filter, i) => (
            <Filter key={i} filter={filter} />
          ))}
        </Flex>

        <Flex gap={4} flex={1} alignItems={"center"} justifyContent={"end"}>
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
          {currentPageConversions.map((conv, i) => (
            <Tr
              key={i}
              cursor={"pointer"}
              onClick={() => {
                selectConversion(conv);
              }}
              _hover={{ background: "rgba(237, 125, 49, 0.26)" }}
            >
              {tableColumns.map((property, i) => {
                return (
                  <Td
                    key={i}
                    textAlign={"center"}
                    color={
                      i === tableColumns.length - 1
                        ? conv.status === ConversionStatus.pending
                          ? "#FA9D45"
                          : conv.status === ConversionStatus.rejected
                          ? "#F71010"
                          : "#4BF84B"
                        : undefined
                    }
                  >
                    {property.getValue(conv)}
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

export default ConversionBrowserContent;
