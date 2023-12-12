import { Button, Flex, Heading } from "@chakra-ui/react";
import { useGlobalState } from "components/utils/GlobalState";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const MobileAdminDashboard = (props: Props) => {
  const navigate = useNavigate();

  const { setActiveTabIndex } = useGlobalState();

  return (
    <Flex
      w="100%"
      h="100%"
      p={6}
      gap={8}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Heading>Admin access is not available on mobile.</Heading>
      <Button
        onClick={() => {
          setActiveTabIndex(0);
          navigate("/");
        }}
      >
        Back
      </Button>
    </Flex>
  );
};

export default MobileAdminDashboard;
