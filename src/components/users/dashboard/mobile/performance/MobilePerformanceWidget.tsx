import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Timeframe, getTimeframeLabel } from "models/enums/Timeframe";
import {
  Conversion,
  averageBetSize,
  averageCommission,
  filterConversionsByTimeframe,
  totalCommission,
  totalUnpaidCommission,
} from "models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { Client, getAllAffiliateDeals } from "models/Client";
import { CompensationGroup } from "models/CompensationGroup";
import { ClientService } from "services/interfaces/ClientService";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { ReferralLinkType } from "models/enums/ReferralLinkType";
import { formatMoney } from "models/utils/Money";
import { AffiliateDeal } from "models/AffiliateDeal";
import Filter, { FilterDefinition } from "components/utils/Filter";
import MobilePerformanceMetricBox from "./MobilePerformanceMetricBox";
import { UserContext } from "components/auth/UserProvider";

type Props = {
  conversions: Conversion[];
};

const MobileUserPerformanceWidget = ({ conversions }: Props) => {
  const conversionService: ConversionService =
    DependencyInjection.conversionService();
  const clientService: ClientService = DependencyInjection.clientService();
  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const { currentUser } = useContext(UserContext);

  // Filters
  const [timeframe, setSelectedTimeframe] = useState<Timeframe>(
    Timeframe.lastMonth
  );
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [compGroup, setCompGroup] = useState<CompensationGroup | null>(null);

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

    const fetchCompGroup = async () => {
      const compGroupId: string | null =
        currentUser?.compensationGroupId ?? null;
      if (!compGroupId) return;

      const compGroup = await compGroupService.get(compGroupId);
      setCompGroup(compGroup);
    };

    fetchCompGroup();
    fetchClients();
  }, [
    conversionService,
    compGroupService,
    clientService,
    currentUser?.compensationGroupId,
  ]);

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
    if (compGroup == null) return clients;
    return clients.filter((client) =>
      compGroup.affiliateLinks.map((link) => link.clientId).includes(client.id)
    );
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
