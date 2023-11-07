import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import GroupedBarChart from "../performance/GroupedBarChart";

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
import SimpleTable from "./SalesTeamTable";

type Props = object;

const SalesTeamTableWidget = (props: Props) => {
  return (
    <Flex
      p={26}
      minHeight={"100%"}
      borderRadius={"20px"}
      minWidth={"35em"}
      width={"95%"}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Flex justifyContent={"space-between"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          Sales Team Performance Snapshot
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

      <SimpleTable />
      <Box h={20}></Box>
    </Flex>
  );
};

export default SalesTeamTableWidget;
