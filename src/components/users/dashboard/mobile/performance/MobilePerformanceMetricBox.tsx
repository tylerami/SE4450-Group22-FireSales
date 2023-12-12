import { Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

const MobilePerformanceMetricBox = ({
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
      justifyContent={"center"}
      gap={2}
      borderRadius="12px"
      width="full"
      border="1px solid lightgray"
      p={{ base: 1, lg: 2 }}
    >
      <Text
        fontWeight={500}
        textAlign={"center"}
        fontSize={"xs"}
        color="#ED7D31"
      >
        {title}{" "}
      </Text>

      <Heading size={"xs"} fontWeight={400}>
        {value}
      </Heading>
      {subtitle && <Text fontSize="0.8em">{subtitle}</Text>}
    </Flex>
  );
};

export default MobilePerformanceMetricBox;
