import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  Th,
  Spacer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Timeframe, getTimeframeLabel } from "models/enums/Timeframe";
import {
  Conversion,
  averageBetSize,
  averageCommission,
  filterConversionsByTimeframe,
  totalCommission,
} from "models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { Client, getAllAffiliateDeals } from "models/Client";
import { CompensationGroup } from "models/CompensationGroup";
import { ClientService } from "services/interfaces/ClientService";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "models/enums/ReferralLinkType";
import { formatMoney } from "models/utils/Money";
import { AffiliateDeal } from "models/AffiliateDeal";
import Filter, { FilterDefinition } from "components/utils/Filter";
import PerformanceMetricBox from "components/common/PerformanceMetricBox";
import UserPerformanceChart from "./UserPerformanceChart";

type Props = {
  conversions: Conversion[];
};

const UserPerformanceWidget = ({ conversions }: Props) => {
  const conversionService: ConversionService =
    DependencyInjection.conversionService();
  const clientService: ClientService = DependencyInjection.clientService();
  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  // Filters
  const [timeframe, setSelectedTimeframe] = useState<Timeframe>(
    Timeframe.lastMonth
  );
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [selectedReferralLinkType, setSelectedReferralLinkType] =
    useState<ReferralLinkType | null>(null);

  const getFilteredConversions = () => {
    let tempConversions = conversions;
    if (selectedClient) {
      tempConversions = tempConversions.filter(
        (conv) => conv.affiliateLink.clientId === selectedClient.id
      );
    }
    if (selectedReferralLinkType) {
      tempConversions = tempConversions.filter(
        (conv) => conv.affiliateLink.type === selectedReferralLinkType
      );
    }

    if (timeframe !== null) {
      tempConversions = filterConversionsByTimeframe(
        tempConversions,
        timeframe
      );
    }
    return tempConversions;
  };

  useEffect(() => {
    const fetchClients = async () => {
      const clients = await clientService.getAll();
      setClients(clients);
    };

    fetchClients();
  }, [conversionService, compGroupService, clientService]);

  const tableColumns: {
    label: string;
    getValue: (conversions: Conversion[]) => string;
  }[] = [
    {
      label: "Conversions",
      getValue: (conversions: Conversion[]) => conversions.length.toString(),
    },
    {
      label: "Total Commission",
      getValue: (conversions: Conversion[]) =>
        formatMoney(totalCommission(conversions)),
    },
    {
      label: "Avg. Bet Size",
      getValue: (conversions: Conversion[]) =>
        formatMoney(averageBetSize(conversions)),
    },

    {
      label: "Avg. Commission",
      getValue: (conversions: Conversion[]) =>
        formatMoney(averageCommission(conversions)),
    },
  ];

  const performanceMetrics = [...tableColumns];

  const timeframes: Timeframe[] = Object.values(Timeframe).filter(
    (value): value is Timeframe => typeof value === "number"
  );

  const referralLinkTypes: ReferralLinkType[] = Object.values(ReferralLinkType);

  const sameAffiliateDeal = (
    conversion: Conversion,
    deal: AffiliateDeal
  ): boolean => {
    if (deal.type === null) {
      return conversion.affiliateLink.clientId === deal.clientId;
    }
    return (
      conversion.affiliateLink.clientId === deal.clientId &&
      conversion.affiliateLink.type === deal.type
    );
  };

  const affiliateDealGroups: {
    deal: AffiliateDeal;
    conversions: Conversion[];
  }[] = getAllAffiliateDeals(clients)
    .map((deal, i) => ({
      deal,
      conversions: getFilteredConversions().filter((conv) =>
        sameAffiliateDeal(conv, deal)
      ),
    }))
    .filter((group) => group.conversions.length > 0);

  affiliateDealGroups.sort(
    (a, b) => b.conversions.length - a.conversions.length
  );
  affiliateDealGroups.sort((a, b) =>
    a.deal.clientName.localeCompare(b.deal.clientName)
  );

  // Define filters

  const filters: FilterDefinition<
    Client | CompensationGroup | Timeframe | ReferralLinkType
  >[] = [
    {
      options: [null, ...clients],
      onChange: (value) => setSelectedClient(value as Client),
      value: selectedClient,

      label: (value) => {
        if (value == null) return "All Clients";
        return (value as Client).name;
      },
    },
    {
      options: [null, ...referralLinkTypes],
      onChange: (value) =>
        setSelectedReferralLinkType(value as ReferralLinkType),
      value: selectedReferralLinkType,

      label: (value) => getReferralLinkTypeLabel(value as ReferralLinkType),
    },

    {
      options: timeframes,
      onChange: (value) => setSelectedTimeframe(value as Timeframe),
      value: timeframe,

      label: (value) => getTimeframeLabel(value as Timeframe),
    },
  ];

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      width={"95%"}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Flex justifyContent={"start"} gap={4}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          Performance Snapshot
        </Heading>

        <Spacer />

        {filters.map((filter, i) => (
          <Filter key={i} filter={filter} />
        ))}
      </Flex>

      <Box h={4}></Box>

      <Flex my={4} gap={2} justifyContent={"space-evenly"}>
        {performanceMetrics.map((metric, i) => (
          <PerformanceMetricBox
            key={i}
            title={metric.label}
            value={metric.getValue(getFilteredConversions()).toString()}
          />
        ))}
      </Flex>

      <Box h={4}></Box>
      <Flex
        width={"100%"}
        minWidth={"80%"}
        justifyContent={"center"}
        alignSelf="center"
        height="full"
      >
        <UserPerformanceChart
          timeframe={timeframe}
          conversions={getFilteredConversions()}
        />
      </Flex>

      <Box h={8}></Box>
      <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
        <Thead>
          <Tr>
            <Th textAlign="center">Sportsbook</Th>
            {tableColumns.map((column, index) => (
              <Th key={index} textAlign="center">
                {column.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {affiliateDealGroups.map(
            ({ deal, conversions: groupConversions }, i) => (
              <Tr key={i}>
                <Td textAlign={"center"}>
                  {deal.clientName} - {getReferralLinkTypeLabel(deal.type)}
                </Td>
                {tableColumns.map((column, i) => (
                  <Td key={i} textAlign={"center"}>
                    {column.getValue(groupConversions).toString()}
                  </Td>
                ))}
              </Tr>
            )
          )}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default UserPerformanceWidget;
