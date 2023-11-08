// I want to see:
// - my performance this week / month / year
// - my commission rate

// - area to upload new sales
// - my conversion history
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
import React, { useState } from "react";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import UserPerformanceSummaryChart from "./UserPerformanceSummaryChart";
import ImageComponent from "../../../utils/ImageComponent";

type Props = {};

const UserPerformanceSummaryWIdget = (props: Props) => {
  const balanceOwed = 10000;

  const performanceMetrics = [
    {
      title: "Conversions",
      value: "12",
    },
    { title: "Earnings", value: "$12,000" },
    { title: "Avg. Bet Size", value: "$100 / bet" },
    { title: "Avg. Commission Rate", value: "$50 / conversion" },
  ];

  const tableHeaders = [
    "Sportsbook",
    "Conversions",
    "Avg. Bet Size",
    "Avg. Commission",
    "Earnings",
  ];

  const tableRows = [
    {
      sportsbook: "PointsBet",
      conversions: 12,
      avgBetSize: 100,
      avgCommission: 50,
      earnings: 600,
    },
    {
      sportsbook: "Bet99",
      conversions: 12,
      avgBetSize: 100,
      avgCommission: 50,
      earnings: 600,
    },
    {
      sportsbook: "Betano",
      conversions: 12,
      avgBetSize: 100,
      avgCommission: 50,
      earnings: 600,
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
      <Flex justifyContent={"space-between"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          My Performance Snapshot
        </Heading>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Filter
          </MenuButton>
          <MenuList>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
            <MenuItem>Option 3</MenuItem>
            {/* Add more MenuItems as needed */}
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
        <UserPerformanceSummaryChart />
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
            value={metric.value}
          ></PerformanceWidgetMetric>
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
          {tableRows.map((row, index) => (
            <Tr key={index}>
              <Td maxW={"5em"} textAlign={"left"}>
                <ImageComponent
                  maxHeight="5em"
                  maxWidth="10em"
                  imagePath={`/sportsbooks/logos/${row.sportsbook.toLowerCase()}-logo-dark.png`}
                />
              </Td>
              <Td textAlign="center">{row.conversions}</Td>
              <Td textAlign="center">${row.avgBetSize.toLocaleString()}</Td>
              <Td textAlign="center">${row.avgCommission.toLocaleString()}</Td>
              <Td textAlign="center">${row.earnings.toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};

const PerformanceWidgetMetric = ({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) => {
  return (
    <Flex
      direction={"column"}
      alignItems={"center"}
      borderRadius="20px"
      width="full"
      mx={4}
      border="1px solid lightgray"
      p={4}
    >
      <Heading size="md" color="#ED7D31">
        {title}{" "}
      </Heading>
      <Box h={2} />
      <Heading size="lg" fontWeight={400}>
        {" "}
        {value}
      </Heading>
      {subtitle && <Text fontSize="0.8em">{subtitle}</Text>}
    </Flex>
  );
};

function formatMoney(amount: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(amount);
}

export default UserPerformanceSummaryWIdget;
