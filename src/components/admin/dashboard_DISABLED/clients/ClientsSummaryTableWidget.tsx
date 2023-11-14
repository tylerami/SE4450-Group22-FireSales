import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";

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
import ClientsSummaryTable from "./ClientsSummaryTable";

type Props = object;

const ClientsSummaryTableWidget = (props: Props) => {
  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      width={"100%"}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Flex justifyContent={"space-between"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          Client Performance Snapshot
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
      <Box h={4}></Box>
      <ClientsSummaryTable></ClientsSummaryTable>
    </Flex>
  );
};

export default ClientsSummaryTableWidget;
