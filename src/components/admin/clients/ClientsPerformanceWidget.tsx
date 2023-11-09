import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  Heading,
  Spacer,
} from "@chakra-ui/react";
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
  Icon,
  Circle,
  Flex,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import ImageComponent from "../../utils/ImageComponent";
import ClientsPerformanceChart from "./ClientsPerformanceChart";

type Props = {};

const ClientsPerformanceWidget = (props: Props) => {
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

  const [expandTable, setExpandTable] = useState<boolean>(false);

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
          Client Performance
        </Heading>
        <Spacer />

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Sportsbook
          </MenuButton>
          <MenuList>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
            <MenuItem>Option 3</MenuItem>
            {/* Add more MenuItems as needed */}
          </MenuList>
        </Menu>
        <Box w={12} />

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Timeframe
          </MenuButton>
          <MenuList>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
            <MenuItem>Option 3</MenuItem>
            {/* Add more MenuItems as needed */}
          </MenuList>
        </Menu>
      </Flex>
      <Box h={8}></Box>
      <Flex
        maxH="60vh"
        width={"100%"}
        minWidth={"80%"}
        justifyContent={"center"}
        alignSelf="center"
        height="full"
      >
        <ClientsPerformanceChart />
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
          {tableRows
            .slice(0, expandTable ? tableRows.length : 1)
            .map((row, index) => (
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
                <Td textAlign="center">
                  ${row.avgCommission.toLocaleString()}
                </Td>
                <Td textAlign="center">${row.earnings.toLocaleString()}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
      <Button
        onClick={() => setExpandTable(!expandTable)}
        rightIcon={expandTable ? <ChevronUpIcon /> : <ChevronDownIcon />}
      >
        {expandTable ? "Collapse Table" : "View All Sportsbooks"}
      </Button>
    </Flex>
  );
};

export default ClientsPerformanceWidget;
