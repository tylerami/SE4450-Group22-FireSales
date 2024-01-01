import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import { UserContext } from "components/auth/UserProvider";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { Conversion } from "models/Conversion";
import MobileRecordConversionsWidget from "./recording/MobileRecordConversionsWidget";

type Props = {};

const MobileConversionsPage = (props: Props) => {
  const { currentUser } = useContext(UserContext);

  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);
  const refresh = () => setUpdateTrigger(!updateTrigger);

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

  const [isConversionSelected, setIsConversionSelected] =
    useState<boolean>(false);

  return (
    <Flex w="100%" alignItems={"center"} direction={"column"} px={2}>
      <Box minH={8}></Box>
      {currentUser?.compensationGroupId ? (
        <React.Fragment>
          {!isConversionSelected && (
            <React.Fragment>
              <MobileRecordConversionsWidget
                refresh={refresh}
                conversions={conversions}
              />
              <Box minH={8}></Box>
            </React.Fragment>
          )}
          {/* <MobileConversionHistoryWidget
            conversions={conversions}
            setIsConversionSelected={setIsConversionSelected}
          /> */}
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
