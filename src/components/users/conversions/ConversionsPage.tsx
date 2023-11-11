import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import BulkRecordConversionsWidgetContent from "./recording/bulk/BulkRecordConversionsWidgetContent";
import RecordConversionsWidget from "./recording/RecordConversionsWidget";
import ConversionHistoryWidget from "./history/ConversionHistoryWidget";

type Props = {};

const ConversionsPage = (props: Props) => {
  return (
    <Flex w="100%" direction={"column"} px={6}>
      <Box minH={8}></Box>
      <RecordConversionsWidget />
      <Box minH={8}></Box>
      <ConversionHistoryWidget />
      <Box minH={20}></Box>
    </Flex>
  );
};

export default ConversionsPage;
