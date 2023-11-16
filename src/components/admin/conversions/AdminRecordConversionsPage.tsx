import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import AdminRecordConversionsWidget from "./AdminRecordConversionsWidget";

type Props = {};

const AdminRecordConversionsPage = (props: Props) => {
  return (
    <Flex
      alignItems={"center"}
      direction={"column"}
      width={"100%"}
      py={2}
      pt={8}
    >
      <AdminRecordConversionsWidget />
      <Box h={40} />
    </Flex>
  );
};

export default AdminRecordConversionsPage;
