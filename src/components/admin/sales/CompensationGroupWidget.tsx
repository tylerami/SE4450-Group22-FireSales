/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Flex,
  Heading,
  Input,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { FaDollarSign } from "react-icons/fa";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Switch,
  InputGroup,
} from "@chakra-ui/react";
import { Image, Box, Text, Icon, Circle } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import ImageComponent from "../../utils/ImageComponent";

type Props = {};

const groups: {
  id: string;
  sportsbooks: {
    sportsbookId: string;
    commission: number;
    minBet: number;
  }[];
  createdAt: Date;
  updatedAt?: Date;
  disabled: boolean;
}[] = [
  {
    id: "1",
    sportsbooks: [
      {
        sportsbookId: "pointsbet",
        commission: 500,
        minBet: 100,
      },
      {
        sportsbookId: "betano",
        commission: 500,
        minBet: 100,
      },
      {
        sportsbookId: "proline",
        commission: 500,
        minBet: 100,
      },
      {
        sportsbookId: "bet99",
        commission: 500,
        minBet: 100,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    disabled: false,
  },
  {
    id: "2",
    sportsbooks: [
      {
        sportsbookId: "pointsbet",
        commission: 500,
        minBet: 100,
      },
      {
        sportsbookId: "betano",
        commission: 500,
        minBet: 100,
      },
      {
        sportsbookId: "proline",
        commission: 500,
        minBet: 100,
      },
      {
        sportsbookId: "bet99",
        commission: 500,
        minBet: 100,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    disabled: false,
  },
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

const existingGroupTableHeaders = ["Group ID", "Enabled", "Sportsbooks"];

const newGroupTableHeaders = [
  "Sportsbook",
  "Enabled",
  "Details",

  "Min. Bet Size",
  "Bets reimbursed",
  "Commission",
];

const CompensationGroupWidget = (props: Props) => {
  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      minWidth={"35em"}
      width={"95%"}
      gap={8}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
        Manage Compensation Groups
      </Heading>

      <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
        <Thead>
          <Tr>
            {existingGroupTableHeaders.map((title, index) => (
              <Th textAlign={"center"} key={index}>
                {title}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {groups.map((group, index) => (
            <Tr key={index}>
              <Td textAlign={"center"}>{group.id}</Td>
              <Td textAlign={"center"}>
                <Switch isChecked={!group.disabled}></Switch>
              </Td>
              <Td textAlign={"center"}>
                {group.sportsbooks.map((sportsbook, index) => (
                  <Flex my={1} justifyContent={"center"} textAlign={"center"}>
                    <Text fontWeight={600} mx={2} textAlign={"center"}>
                      {" "}
                      {sportsbook.sportsbookId}:{" "}
                    </Text>
                    <Text>
                      ${sportsbook.minBet} min. bet @ ${sportsbook.commission} /
                      conv.{" "}
                    </Text>
                  </Flex>
                ))}
              </Td>
              <Td>
                <Button>Edit</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
        Create New Group
      </Heading>

      <Flex direction={"column"}>
        <Flex alignItems={"center"}>
          <Input placeholder="Group ID" />

          <Box w={12}></Box>
          <Heading size="sm">Enabled</Heading>
          <Switch mx={4}></Switch>
        </Flex>
      </Flex>

      <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
        <Thead>
          <Tr>
            {newGroupTableHeaders.map((header, index) => (
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
              <Td textAlign="center">
                <Switch></Switch>
              </Td>
              <Td textAlign={"center"}>
                <Text>CPA: $300</Text>
                <Box h={2}></Box>
                <Text>Target Bet: $300</Text>
              </Td>

              <Td textAlign={"center"}>
                <InputGroup width="8em" margin="auto">
                  <InputLeftElement>
                    <Icon as={FaDollarSign} color="gray" />
                  </InputLeftElement>
                  <Input pl={8} type="number" placeholder="Bet size" />
                </InputGroup>
              </Td>
              <Td textAlign={"center"}>
                {" "}
                <Switch></Switch>
              </Td>
              <Td textAlign={"center"}>
                <InputGroup width="12em" margin="auto">
                  <InputLeftElement>
                    <Icon as={FaDollarSign} color="gray" />
                  </InputLeftElement>
                  <Input pl={8} type="number" placeholder="Commission" />
                </InputGroup>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Button>Create New Group</Button>
    </Flex>
  );
};

export default CompensationGroupWidget;
