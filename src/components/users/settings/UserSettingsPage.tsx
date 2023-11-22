import { Box, Flex, Input } from "@chakra-ui/react";
import React from "react";
import AccountSettingsWidget from "./AccountSettingsWidget";
import PaymentSettingsWidget from "./PaymentSettingsWidget";

type Props = {};

const UserSettingsPage = (props: Props) => {
  return (
    <Flex direction={"column"} w="100%" alignItems={"center"}>
      <Box h={8} />
      <AccountSettingsWidget></AccountSettingsWidget>
      <Box h={8} />
      <PaymentSettingsWidget></PaymentSettingsWidget>
      <Box h={200} />
    </Flex>
  );
};

export default UserSettingsPage;
