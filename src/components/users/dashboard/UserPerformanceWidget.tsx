// I want to see:
// - my performance this week / month / year
// - my commission rate

// - area to upload new sales
// - my conversion history
import { Box, Flex, Heading } from "@chakra-ui/react";
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
import ImageComponent from "../../utils/ImageComponent";

const sportsbooks = ["pointsbet", "betano", "bet99"];

type Props = {};

const UserPerformanceWidget = (props: Props) => {
  const performanceMetrics = [
    {
      title: "Conversions",
      value: "12",
    },
    { title: "Earnings", value: "$12,000" },
    { title: "Commission Rate", value: "$50/conversion" },
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
      <Flex justifyContent={"space-evenly"}>
        {performanceMetrics.map((metric, i) => (
          <PerformanceWidgetMetric
            key={i}
            title={metric.title}
            value={metric.value}
          ></PerformanceWidgetMetric>
        ))}
      </Flex>
      <Box h={12}></Box>
      <Button size="lg" p={6} width={"full"} colorScheme="orange">
        Record Conversions
      </Button>
    </Flex>
  );
};

const PerformanceWidgetMetric = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <Flex direction={"column"} alignItems={"center"} gap={6}>
      <Heading color="#ED7D31">{title} </Heading>
      <Heading fontWeight={400}> {value}</Heading>
    </Flex>
  );
};

export default UserPerformanceWidget;
