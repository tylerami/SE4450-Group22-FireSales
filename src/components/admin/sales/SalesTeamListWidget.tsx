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
  Circle,
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { FiSearch, FiUser } from "react-icons/fi";
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
import { User } from "../../../models/User";

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
type Props = {
  setSelectedUser: (user: User) => void;
};

const SalesTeamListWidget = (props: Props) => {
  const colTitles = [
    "Name",
    "Conversions",
    "Profit Generated",
    "Account Balance",
    "Compensation Group",
    "Unverified Conversions",
  ];

  const maxRows = 6;

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      minWidth={"35em"}
      width={"95%"}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Flex justifyContent={"space-between"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          Manage Sales Team
        </Heading>

        <InputGroup maxWidth="40%">
          <InputLeftElement>
            <Icon _hover={{ color: "#434343" }} as={FiSearch} />
          </InputLeftElement>
          <Input
            focusBorderColor="#ED7D31"
            variant={"filled"}
            placeholder="Search..."
          ></Input>
        </InputGroup>

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

      <Box h={10}></Box>
      <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
        <Thead>
          <Tr>
            {colTitles.map((title, index) => (
              <Th textAlign={"center"} key={index}>
                {title}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {defaultRows
            .slice(0, Math.min(defaultRows.length, maxRows))
            .map((row, index) => (
              <Tr
                _hover={{ background: "rgba(237, 125, 49, 0.26)" }}
                textAlign={"center"}
                key={index}
                transition={"all 0.2s ease-in-out"}
                cursor={"pointer"}
                onClick={(e) => props.setSelectedUser({} as User)}
                height={"5em"}
              >
                <Td maxWidth={"10em"} textAlign="center">
                  <Flex justifyContent={"center"}>
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
                <Td textAlign="center">0</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default SalesTeamListWidget;
