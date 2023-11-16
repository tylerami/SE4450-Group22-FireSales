import {
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  Icon,
  IconButton,
  InputGroup,
  InputRightElement,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { ArrowForwardIcon, ArrowUpIcon, CloseIcon } from "@chakra-ui/icons";
import { FiUser } from "react-icons/fi";

type Props = {
  fromSelf: boolean;
  text: string;
};

const ConversionMessageTile = (props: Props) => {
  const color = props.fromSelf ? "#ED7D31" : "gray.200";

  return (
    <Flex
      w="100%"
      p={2}
      justifyContent={props.fromSelf ? "end" : "start"}
      alignItems={"end"}
    >
      {!props.fromSelf && (
        <Circle size="30px" bg={color}>
          <Icon as={FiUser} />
        </Circle>
      )}
      <Box mx={4} borderRadius={"12px"} background={color} w={"70%"} p={4}>
        <Text fontSize={"xs"}>{props.text}</Text>
      </Box>
      {props.fromSelf && (
        <Circle size="30px" bg={color}>
          <Icon as={FiUser} />
        </Circle>
      )}
    </Flex>
  );
};

export default ConversionMessageTile;
