import React from "react";
import { Box } from "@chakra-ui/react";
import RecordConversionsWidget from "./RecordConversionsWidget";
import BulkRecordConversionsWidget from "./BulkRecordConversionsWidget";

type Props = {};

const RecordConversionsPage = (props: Props) => {
  return (
    <React.Fragment>
      <Box minH={8}></Box>
      <RecordConversionsWidget></RecordConversionsWidget>

      <Box minH={8}></Box>

      <BulkRecordConversionsWidget></BulkRecordConversionsWidget>
      <Box minH={20}></Box>
    </React.Fragment>
  );
};

export default RecordConversionsPage;
