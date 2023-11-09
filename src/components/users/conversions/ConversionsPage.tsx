import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import BulkRecordConversionsWidgetContent from "./recording/bulk/BulkRecordConversionsWidgetContent";
import RecordConversionsWidget from "./recording/RecordConversionsWidget";
import ConversionHistoryWidget from "./ConversionHistoryWidget";

type Props = {};

const ConversionsPage = (props: Props) => {
  return (
    <React.Fragment>
      <Box minH={8}></Box>
      <RecordConversionsWidget />
      <Box minH={8}></Box>
      <ConversionHistoryWidget />
      <Box minH={20}></Box>
    </React.Fragment>
  );
};

export default ConversionsPage;
