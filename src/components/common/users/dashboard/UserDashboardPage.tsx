import { Box, Center, Flex, Heading, Spinner } from "@chakra-ui/react";
import React, { useContext } from "react";
import UserPerformanceWidget from "./performance/UserPerformanceWidget";
import AffiliateLinkWidget from "./referrals/AffiliateLinkWidget";
import { UserContext } from "components/auth/UserProvider";

type Props = {};

const UserDashboardPage = (props: Props) => {
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return (
      <Center w="100%" h="20em">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <React.Fragment>
      <Flex alignSelf="start" px={8} py={2} pt={8}>
        <Heading size="lg" mr={2} fontWeight={400}>
          Welcome,
        </Heading>
        <Heading size="lg" fontWeight={400} color="#ED7D31">
          {currentUser?.firstName}
        </Heading>
      </Flex>

      {/* Column: Performance chart and table */}
      <Flex width={"100%"} direction="column" gap={6} alignItems={"center"}>
        <Box></Box>
        <AffiliateLinkWidget></AffiliateLinkWidget>
        <UserPerformanceWidget />

        <Box h={20}></Box>
      </Flex>
    </React.Fragment>
  );
};

export default UserDashboardPage;
