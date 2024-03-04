import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import { UserContext } from "components/auth/UserProvider";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import { Conversion } from "src/models/Conversion";
import MobileRecordConversionsWidget from "./recording/MobileRecordConversionsWidget";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { CompensationGroup } from "src/models/CompensationGroup";

type Props = {};

// todo: eliminate component duplication as much as possible --> horrible for code maintenance
const MobileConversionsPage = (props: Props) => {
  const { currentUser } = useContext(UserContext);

  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);
  const refresh = () => setUpdateTrigger(!updateTrigger);

  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const [compensationGroup, setCompensationGroup] =
    useState<CompensationGroup | null>(null);

  useEffect(() => {
    const fetchCompensationGroup = async () => {
      const compGroupId = currentUser?.compensationGroupId;
      if (!compGroupId) {
        return;
      }
      const compGroup = await compGroupService.get(compGroupId);
      setCompensationGroup(compGroup);
    };

    fetchCompensationGroup();
  }, [compGroupService, currentUser?.compensationGroupId]);

  useEffect(() => {
    const fetchConversions = async () => {
      if (!currentUser) return;

      let convs = await conversionService.query({
        userId: currentUser.uid,
      });
      setConversions(convs);
    };

    fetchConversions();
  }, [conversionService, currentUser, updateTrigger]);

  return (
    <Flex w="100%" alignItems={"center"} direction={"column"} px={2}>
      <Box minH={8}></Box>
      {currentUser?.compensationGroupId ? (
        <React.Fragment>
          <MobileRecordConversionsWidget
            refresh={refresh}
            conversions={conversions}
            compensationGroup={compensationGroup}
          />
          <Box minH={8}></Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Heading mt={20} size="md" textAlign={"center"}>
            You're account has not yet been approved to record conversions.
          </Heading>
          <Text size="sm" textAlign={"center"}>
            We are working hard to get you on the team ASAP!
          </Text>
        </React.Fragment>
      )}
      <Box minH={20}></Box>
    </Flex>
  );
};

export default MobileConversionsPage;
