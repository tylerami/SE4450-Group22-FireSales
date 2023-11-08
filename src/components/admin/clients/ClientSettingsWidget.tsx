import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  Heading,
  Switch,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React from "react";
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
import { ChevronDownIcon } from "@chakra-ui/icons";
import ImageComponent from "../../utils/ImageComponent";
import { FaDollarSign } from "react-icons/fa";

type Props = {};

const ClientsSettingsWidget = (props: Props) => {
  const tableHeaders = [
    "Sportsbook",
    "Enabled",
    "CPA",
    "Target Avg. Bet Size",
    "Avg. Payout Time (days)",
    "",
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
          Client Settings
        </Heading>
      </Flex>
      <Box h={4}></Box>

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
              <Td textAlign="center">
                <Switch></Switch>
              </Td>
              <Td textAlign={"center"}>
                <InputGroup width="8em" margin="auto">
                  <InputLeftElement>
                    <Icon as={FaDollarSign} color="gray" />
                  </InputLeftElement>
                  <Input pl={8} type="number" placeholder="CPA" />
                </InputGroup>
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
                <Input width="6em" type="number" placeholder="# Days" />
              </Td>
              <Td>
                <Button colorScheme="blue">Save</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button my={4}>Add New</Button>
    </Flex>
  );
};

export default ClientsSettingsWidget;
