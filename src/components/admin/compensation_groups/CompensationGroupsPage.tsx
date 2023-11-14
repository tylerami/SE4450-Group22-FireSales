import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import CompensationGroupWidget from "./CompensationGroupWidget";

type Props = {};

const CompensationGroupsPage = (props: Props) => {
  return (
    <Flex
      alignItems={"center"}
      direction={"column"}
      width={"100%"}
      py={2}
      pt={8}
    >
      <CompensationGroupWidget />
      <Box h={40} />
    </Flex>
  );
};

export default CompensationGroupsPage;
