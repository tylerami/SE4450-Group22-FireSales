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
import { FiUser } from "react-icons/fi";

// Define a type for the row structure
type TableRowData = {
  profilePictureSrc: string | null;
  name: string;
  conversions: number;
  revenue: number;
  commissionRate: number;
  accountBalance: string;
};

// Define the props for the component
type SalesTeamTableProps = {
  rows?: TableRowData[];
};

const defaultRows = [
  {
    profilePictureSrc: null,
    name: "Tyler Amirault",
    conversions: 10,
    revenue: 3000,
    commissionRate: 50,
    accountBalance: "-5000",
  },
  {
    profilePictureSrc: null,
    name: "Tyler Amirault",
    conversions: 10,
    revenue: 3000,
    commissionRate: 50,
    accountBalance: "-5000",
  },
  {
    profilePictureSrc: null,
    name: "Tyler Amirault",
    conversions: 10,
    revenue: 3000,
    commissionRate: 50,
    accountBalance: "-5000",
  },
];

const SalesTeamTable: React.FC<SalesTeamTableProps> = ({
  rows = defaultRows,
}) => {
  const colTitles = [
    "Name",
    "Conversions",
    "Revenue",
    "Account Balance",
    "Rank",
  ];

  return (
    <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
      <Thead>
        <Tr>
          {colTitles.map((title, index) => (
            <Th key={index}>{title}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row, index) => (
          <Tr textAlign={"center"} key={index} height={"5em"}>
            <Td textAlign="center">
              <Flex>
                {row.profilePictureSrc ? (
                  <Image
                    borderRadius="full"
                    boxSize="40px"
                    src={row.profilePictureSrc}
                    alt={row.name}
                    mr={2}
                  />
                ) : (
                  <Circle size="40px" bg="gray.200" mr="2">
                    <Icon as={FiUser} />
                  </Circle>
                )}

                <Text ml={2} textAlign={"left"}>
                  {row.name}
                </Text>
              </Flex>
            </Td>
            <Td textAlign={"center"}>{row.conversions}</Td>
            <Td textAlign="center">${row.revenue.toLocaleString()}</Td>
            <Td
              textAlign="center"
              color={
                row.accountBalance.startsWith("-") ? "red.500" : "green.500"
              }
            >
              {row.accountBalance.startsWith("-")
                ? `(${row.accountBalance})`
                : row.accountBalance}
            </Td>
            <Td textAlign="center">#{index + 1}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default SalesTeamTable;
