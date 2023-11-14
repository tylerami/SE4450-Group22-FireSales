import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import ClientsPerformanceWidget from "./ClientsPerformanceWidget";

type Props = {};

const PerformancePage = (props: Props) => {
  return (
    <Flex direction={"column"} alignItems={"center"} w="100%">
      <Flex width={"100%"} px={8} py={6}>
        <Heading size="lg" mr={2} fontWeight={400}>
          Welcome,
        </Heading>
        <Heading size="lg" fontWeight={400} color="#ED7D31">
          Tyler
        </Heading>
      </Flex>

      <ClientsPerformanceWidget />

      <Box h={40} />
    </Flex>
  );
};

export default PerformancePage;
