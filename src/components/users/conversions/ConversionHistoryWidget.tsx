import React, { useState, useCallback } from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  Spacer,
  Switch,
} from "@chakra-ui/react";

type Props = {};

const ConversionHistoryWidget = (props: Props) => {
  return (
    <Flex
      p={26}
      borderRadius="20px"
      width="95%"
      gap={2}
      flexDirection="column"
      boxShadow="3px 4px 12px rgba(0, 0, 0, 0.2)"
    >
      <Flex w="100%" alignItems={"center"}>
        <Heading as="h1" fontSize="1.2em" fontWeight={700}>
          Conversion History
        </Heading>
      </Flex>
    </Flex>
  );
};

export default ConversionHistoryWidget;
