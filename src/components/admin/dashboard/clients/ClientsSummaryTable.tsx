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
  partnershipDate: string;
  revenue: number;
  salesGenerated: number;
  accountsReceivable: string;
};

// Define the props for the component
type CleintsSummaryTableProps = {
  rows?: TableRowData[];
};

const defaultRows: TableRowData[] = [
  {
    profilePictureSrc: null, // Assuming no actual image URLs are provided
    name: "Slack",
    partnershipDate: "Dec, 2022",
    revenue: 357200,
    salesGenerated: 196,
    accountsReceivable: "$45,490",
  },
  {
    profilePictureSrc: null, // Assuming no actual image URLs are provided
    name: "Figma",
    partnershipDate: "Apr, 2022",
    revenue: 584700,
    salesGenerated: 146,
    accountsReceivable: "$32,490",
  },
  // Add more rows as per the actual data you want to represent.
];

const CleintsSummaryTable: React.FC<CleintsSummaryTableProps> = ({
  rows = defaultRows,
}) => {
  return (
    <Table variant="simple" alignSelf={"center"} width={"100%"}>
      <Thead>
        <Tr>
          <Th textAlign="center">Client</Th>
          <Th textAlign="center" isNumeric>
            Revenue
          </Th>
          <Th textAlign="center" isNumeric>
            Sales{" "}
          </Th>
          <Th textAlign="center" isNumeric>
            Accounts Receivable
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row, index) => (
          <Tr key={index} height={"5em"}>
            <Td>
              <Flex display="flex" gap={2} alignItems="center">
                <Circle size="40px" bg="gray.200" mr="2">
                  <Icon as={FiUser} />
                </Circle>

                <Box>
                  <Text fontWeight="semibold">{row.name}</Text>
                  <Text fontSize="sm">{row.partnershipDate}</Text>
                </Box>
              </Flex>
            </Td>
            <Td textAlign="center" isNumeric>
              ${row.revenue.toLocaleString()}
            </Td>
            <Td textAlign="center" isNumeric>
              {row.salesGenerated}
            </Td>
            <Td
              textAlign="center"
              isNumeric
              color={row.accountsReceivable === "$-" ? "red.500" : "green.500"}
            >
              {row.accountsReceivable}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default CleintsSummaryTable;
