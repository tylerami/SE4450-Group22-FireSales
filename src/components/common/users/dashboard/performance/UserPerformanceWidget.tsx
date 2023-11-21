import {
  Box,
  Flex,
  Heading,
  Table,
  Text,
  Thead,
  Tr,
  Tbody,
  Td,
  Th,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";

import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import UserPerformanceChart from "./UserPerformanceChart";
import { Timeframe, getTimeframeLabel } from "models/enums/Timeframe";
import { sampleConversions } from "__mocks__/models/Conversion.mock";
import {
  Conversion,
  averageBetSize,
  averageCommission,
  filterConversionsByTimeframe,
  totalCommission,
} from "models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";
import { Client } from "models/Client";
import { CompensationGroup } from "models/CompensationGroup";
import { ClientService } from "services/interfaces/ClientService";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { AffiliateLink } from "models/AffiliateLink";
import { getReferralLinkTypeLabel } from "models/enums/ReferralLinkType";
import { generateSampleCompensationGroups } from "__mocks__/models/CompensationGroup.mock";
import { formatMoney } from "models/utils/Money";
import PerformanceWidgetMetric from "./PerformanceWidgetMetric";

type Props = {};

const UserPerformanceWidget = (props: Props) => {
  const conversionService: ConversionService =
    DependencyInjection.conversionService();
  const clientService: ClientService = DependencyInjection.clientService();
  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.lastMonth);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [filteredConversions, setFilteredConversions] = useState<Conversion[]>(
    []
  );
  const [compensationGroup, setCompensationGroup] =
    useState<CompensationGroup | null>(null);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchConversions = async () => {
      if (currentUser == null) return;
      const conversions = await conversionService.query({
        userId: currentUser.uid,
      });
      setConversions(conversions);
    };

    const fetchCompensationGroup = async () => {
      if (!currentUser?.compensationGroupId) return;
      const compensationGroup = await compGroupService.get(
        currentUser.compensationGroupId
      );
      setCompensationGroup(compensationGroup);
    };

    fetchConversions();
    fetchCompensationGroup();
  }, [conversionService, currentUser, compGroupService, clientService]);

  const handleChangeTimeframe = (timeframe: Timeframe) => {
    setTimeframe(timeframe);
    setFilteredConversions(
      filterConversionsByTimeframe(conversions, timeframe)
    );
  };

  // todo: implement
  const balanceOwed = 10000;

  const performanceMetrics = [
    {
      title: "Conversions",
      getValue: (conversions: Conversion[]) => conversions.length,
    },
    {
      title: "Earnings",
      getValue: (conversions: Conversion[]) =>
        formatMoney(totalCommission(conversions)),
    },
    {
      title: "Avg. Bet Size",
      getValue: (conversions: Conversion[]) =>
        formatMoney(averageBetSize(conversions)),
    },
    {
      title: "Avg. Commission Rate",
      getValue: (conversions: Conversion[]) =>
        formatMoney(averageCommission(conversions)),
    },
  ];

  const tableHeaders = [
    "Sportsbook",
    "Link Type",
    "Conversions",
    "Earnings",
    "Avg. Bet Size",
    "Avg. Commission",
  ];

  const timeframes: Timeframe[] = Object.values(Timeframe).filter(
    (value): value is Timeframe => typeof value === "number"
  );

  const sameAffiliateLink = (
    conversion: Conversion,
    link: AffiliateLink
  ): boolean =>
    conversion.affiliateLink.clientId === link.clientId &&
    conversion.affiliateLink.type === link.type;

  const affiliateLinkGroups: {
    link: AffiliateLink;
    conversions: Conversion[];
  }[] = (compensationGroup?.affiliateLinks ?? []).map((link, i) => ({
    link,
    conversions: filteredConversions.filter((conv) =>
      sameAffiliateLink(conv, link)
    ),
  }));

  affiliateLinkGroups.sort(
    (a, b) => b.conversions.length - a.conversions.length
  );
  affiliateLinkGroups.sort((a, b) =>
    a.link.clientName.localeCompare(b.link.clientName)
  );

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      width={"95%"}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Flex justifyContent={"space-between"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          My Performance Snapshot
        </Heading>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {getTimeframeLabel(timeframe)}
          </MenuButton>
          <MenuList>
            {timeframes.map((tf, index) => (
              <MenuItem key={index} onClick={() => handleChangeTimeframe(tf)}>
                {getTimeframeLabel(tf)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>

      <Flex>
        <Heading fontWeight={400} size="lg">
          Balance Owed:{" "}
        </Heading>

        <Heading
          mx={2}
          color={balanceOwed > 0 ? "green" : "black"}
          fontWeight={400}
          size="lg"
        >
          {formatMoney(balanceOwed)}
        </Heading>
      </Flex>
      <Box h={1}></Box>

      <Text color="gray">Est. paid by 2023-11-08</Text>
      <Box h={4}></Box>

      <Flex
        maxH="60vh"
        width={"100%"}
        minWidth={"80%"}
        justifyContent={"center"}
        alignSelf="center"
        height="full"
      >
        <UserPerformanceChart
          timeframe={timeframe}
          conversions={filteredConversions}
        />
      </Flex>

      <Box h={6}></Box>

      <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
        Key Metrics Summary
      </Heading>

      <Box h={4}></Box>

      <Flex my={4} justifyContent={"space-evenly"}>
        {performanceMetrics.map((metric, i) => (
          <PerformanceWidgetMetric
            key={i}
            title={metric.title}
            value={metric.getValue(filteredConversions).toString()}
          />
        ))}
      </Flex>
      <Box h={8}></Box>
      <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
        <Thead>
          <Tr>
            {tableHeaders.map((header, index) => (
              <Th key={index} textAlign="center">
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {affiliateLinkGroups.map(
            ({ link, conversions: groupConversions }, i) => (
              <Tr key={i}>
                <Td textAlign={"center"}>{link.clientName}</Td>
                <Td textAlign={"center"}>
                  {getReferralLinkTypeLabel(link.type)}
                </Td>
                {performanceMetrics.map((metric, i) => (
                  <Td key={i} textAlign={"center"}>
                    {metric.getValue(groupConversions).toString()}
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
