import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import PayoutsWidget from "./PayoutsWidget";

type Props = {};

const PayoutsPage = (props: Props) => {
  return (
    <Flex
      alignItems={"center"}
      direction={"column"}
      width={"100%"}
      py={2}
      pt={8}
    >
      <PayoutsWidget />
      <Box h={40} />
    </Flex>
  );
};

export default PayoutsPage;
