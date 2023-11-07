import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import UserPerformanceWidget from "./UserPerformanceWidget";
import ReferralLinkWidget from "./ReferralLinkWidget";

type Props = {};

const UserDashboardPage = (props: Props) => {
  return (
    <React.Fragment>
      <Flex alignSelf="start" px={8} py={2} pt={8}>
        <Heading size="lg" mr={2} fontWeight={400}>
          Welcome,
        </Heading>
        <Heading size="lg" fontWeight={400} color="#ED7D31">
          Tyler
        </Heading>
      </Flex>

      {/* Column: Performance chart and table */}
      <Flex
        width={{ base: "100%", xl: "100%" }} // Full width on base, half on larger screens
        direction="column"
        gap={6}
        alignItems={"center"}
      >
        <Box h={2}></Box>
        <ReferralLinkWidget></ReferralLinkWidget>
        <UserPerformanceWidget></UserPerformanceWidget>

        <Box h={20}></Box>
      </Flex>
    </React.Fragment>
  );
};

export default UserDashboardPage;
