import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

type Props = {};

const AccountSettingsWidget = (props: Props) => {
  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      width={"95%"}
      gap={6}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Flex justifyContent={"space-between"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          Account Settings
        </Heading>

        <Button> Save Changes</Button>
      </Flex>
      <Flex width={"48%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Full name*
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            placeholder="Full name"
          ></Input>
        </InputGroup>
      </Flex>
      <Flex width={"48%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Primary email*
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            placeholder="Primary email"
          ></Input>
        </InputGroup>
      </Flex>
      <Flex width={"48%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Phone number
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            placeholder="Phone number"
          ></Input>
        </InputGroup>
      </Flex>
    </Flex>
  );
};

export default AccountSettingsWidget;
