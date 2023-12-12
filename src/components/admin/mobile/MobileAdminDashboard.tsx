import { Flex, Heading } from "@chakra-ui/react";
import React from "react";

type Props = {};

const MobileAdminDashboard = (props: Props) => {
  return (
    <Flex
      w="100%"
      h="100%"
      p={6}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Heading>Admin access is not available on mobile.</Heading>
    </Flex>
  );
};

export default MobileAdminDashboard;
