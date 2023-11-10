// I want to see:
// - my performance this week / month / year
// - my commission rate

// - area to upload new sales
// - my conversion history
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

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

export default PerformanceWidgetMetric;
