import { Box, Center, Flex, Heading, Spinner } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import UserPerformanceWidget from "./performance/UserPerformanceWidget";
import AffiliateLinkWidget from "./referrals/AffiliateLinkWidget";
import { UserContext } from "components/auth/UserProvider";
import { Conversion } from "src/models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import UserAnnouncementsWidget from "./announcements/UserAnnouncementsWidget";

type Props = {};

const UserDashboardPage = (props: Props) => {
  const { currentUser } = useContext(UserContext);

  const [conversions, setConversions] = useState<Conversion[]>([]);

  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  useEffect(() => {
    const fetchConversions = async () => {
      if (!currentUser?.uid) {
        return;
      }
      const fetchedConversions = await conversionService.query({
        userId: currentUser?.uid,
      });
      setConversions(fetchedConversions ?? []);
    };
    fetchConversions();
  }, [conversionService, currentUser?.uid]);

  if (!currentUser) {
    return (
      <Center w="100%" h="20em">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <React.Fragment>
      <Flex alignSelf="start" px={8} py={6}>
        <Heading size="lg" mr={2} fontWeight={400}>
          Welcome,
        </Heading>
        <Heading size="lg" fontWeight={400} color="#ED7D31">
          {currentUser?.firstName}
        </Heading>
      </Flex>

      {/* Column: Performance chart and table */}
      <Flex width={"100%"} direction="column" gap={6} alignItems={"center"}>
        <UserAnnouncementsWidget />
        <AffiliateLinkWidget></AffiliateLinkWidget>
        <UserPerformanceWidget conversions={conversions} />

        <Box h={20}></Box>
      </Flex>
    </React.Fragment>
  );
};

export default UserDashboardPage;
