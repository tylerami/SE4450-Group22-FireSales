import React from "react";
import ClientsPerformanceWidget from "./performance/ClientsPerformanceWidget";
import { Box, Flex } from "@chakra-ui/react";
import ClientsSettingsWidget from "./settings/ClientSettingsWidget";

type Props = {};

const AdminClientsPage = (props: Props) => {
  return (
    <Flex w="100%" gap={8} alignItems={"center"} direction={"column"}>
      <Box />
      <ClientsPerformanceWidget></ClientsPerformanceWidget>
      <ClientsSettingsWidget></ClientsSettingsWidget>
      <Box h={20} />
    </Flex>
  );
};

export default AdminClientsPage;
