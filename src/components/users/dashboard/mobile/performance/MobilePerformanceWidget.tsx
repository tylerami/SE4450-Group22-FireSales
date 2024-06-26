import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Timeframe, getTimeframeLabel } from "src/models/enums/Timeframe";
import {
  Conversion,
  allClientIds,
  averageBetSize,
  averageCommission,
  filterConversionsByTimeframe,
  totalCommission,
  totalUnpaidCommission,
} from "src/models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import { Client, getAllAffiliateDeals } from "src/models/Client";
import { CompensationGroup } from "src/models/CompensationGroup";
import { ClientService } from "services/interfaces/ClientService";
import { ReferralLinkType } from "src/models/enums/ReferralLinkType";
import { formatMoney } from "src/models/utils/Money";
import { AffiliateDeal } from "src/models/AffiliateDeal";
import Filter, { FilterDefinition } from "components/utils/Filter";
import MobilePerformanceMetricBox from "./MobilePerformanceMetricBox";

type Props = {
  conversions: Conversion[];
};

const MobileUserPerformanceWidget = ({ conversions }: Props) => {
  const conversionService: ConversionService =
    DependencyInjection.conversionService();
  const clientService: ClientService = DependencyInjection.clientService();

  // Filters
  const [timeframe, setSelectedTimeframe] = useState<Timeframe>(
    Timeframe.lastMonth
  );
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const getFilteredConversions = () => {
    let tempConversions = conversions;
    if (selectedClient) {
      tempConversions = tempConversions.filter(
        (conv) => conv.affiliateLink.clientId === selectedClient.id
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
  }, [conversionService, clientService]);

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

  const getRelevantClients = (): Client[] => {
    const clientIds = allClientIds(conversions);
    return clients.filter((client) => clientIds.includes(client.id));
  };

  const filters: FilterDefinition<
    Client | CompensationGroup | Timeframe | ReferralLinkType
  >[] = [
    {
      options: [null, ...getRelevantClients()],
      onChange: (value) => setSelectedClient(value as Client),
      value: selectedClient,

      label: (value) => {
        if (value == null) return "All Clients";
        return (value as Client).name;
      },
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
      {" "}
      <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
        Performance Snapshot
      </Heading>{" "}
      <Flex w="100%" gap={2} alignItems={"center"}>
        <Text my={2} fontSize={"sm"}>
          Amount Owed:
        </Text>
        <Text color="darkgreen">
          {formatMoney(totalUnpaidCommission(conversions))}
        </Text>
      </Flex>
      <Box h={2}></Box>
      <Flex justifyContent={"start"} gap={4}>
        {filters.map((filter, i) => (
          <Filter key={i} filter={filter} />
        ))}
      </Flex>{" "}
      <Box h={4}></Box>
      <Flex
        gap={2}
        justifyContent="space-evenly"
        flexWrap="wrap" // Enable wrapping of child elements
      >
        {performanceMetrics.map((metric, i) => (
          <Box
            key={i}
            width="46%" // Set width to slightly less than half to accommodate the gap
          >
            <MobilePerformanceMetricBox
              title={metric.label}
              value={metric.getValue(getFilteredConversions()).toString()}
            />
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

export default MobileUserPerformanceWidget;
