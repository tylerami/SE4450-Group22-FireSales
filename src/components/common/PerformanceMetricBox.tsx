import { Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

const PerformanceMetricBox = ({
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
        fontSize={{ base: "2xs", lg: "xs", xl: "sm" }}
        color="#ED7D31"
      >
        {title}{" "}
      </Text>

      <Heading size={{ base: "sm", lg: "md", xl: "lg" }} fontWeight={400}>
        {value}
      </Heading>
      {subtitle && <Text fontSize="0.8em">{subtitle}</Text>}
    </Flex>
  );
};

export default PerformanceMetricBox;
