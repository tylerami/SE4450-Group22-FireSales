import { Box, Flex, Input } from "@chakra-ui/react";
import React from "react";
import AccountSettingsWidget from "./AccountSettingsWidget";
import PaymentSettingsWidget from "./PaymentSettingsWidget";

type Props = {};

const UserSettingsPage = (props: Props) => {
  return (
    <React.Fragment>
      <Box h={8} />
      <AccountSettingsWidget></AccountSettingsWidget>
      <Box h={8} />
      <PaymentSettingsWidget></PaymentSettingsWidget>
      <Box h={20} />
    </React.Fragment>
  );
};

export default UserSettingsPage;
