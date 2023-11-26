import React, { useContext, useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import BulkRecordConversionsWidgetContent from "./recording/bulk/BulkRecordConversionsWidgetContent";
import RecordConversionsWidget from "./recording/RecordConversionsWidget";
import ConversionHistoryWidget from "./history/ConversionHistoryWidget";
import { UserContext } from "components/auth/UserProvider";

type Props = {};

const ConversionsPage = (props: Props) => {
  const { currentUser } = useContext(UserContext);

  const [isConversionSelected, setIsConversionSelected] =
    useState<boolean>(false);

  const [minimizeRecordConversion, setMinimizeRecordConversions] =
    useState<boolean>(false);

  return (
    <Flex w="100%" alignItems={"center"} direction={"column"} px={6}>
      <Box minH={8}></Box>
      {currentUser?.compensationGroupId ? (
        <React.Fragment>
          {!isConversionSelected && (
            <React.Fragment>
              <RecordConversionsWidget
                minimizeRecordConversion={minimizeRecordConversion}
                setMinimizeRecordConversions={setMinimizeRecordConversions}
              />
              <Box minH={8}></Box>
            </React.Fragment>
          )}
          <ConversionHistoryWidget
            setIsConversionSelected={setIsConversionSelected}
          />
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

export default ConversionsPage;
