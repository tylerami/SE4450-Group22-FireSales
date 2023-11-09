import React, { useState, useCallback } from "react";
import {
  Button,
  Heading,
  Input,
  InputGroup,
  Spacer,
  Switch,
} from "@chakra-ui/react";
import RecordConversionTile from "./manual/ManualRecordConversionTile";
import { AddIcon } from "@chakra-ui/icons";
import { Conversion } from "../../../../models/Conversion";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Box,
  Text,
  Icon,
  Circle,
  Flex,
} from "@chakra-ui/react";
import ManualRecordConversionsWidgetContent from "./manual/ManualRecordConversionsWidgetContent";
import BulkRecordConversionsWidgetContent from "./bulk/BulkRecordConversionsWidgetContent";

type Props = {};

enum RecordMode {
  manual,
  bulk,
}

const RecordConversionsWidget = (props: Props) => {
  const [recordMode, setRecordMode] = useState<RecordMode>(RecordMode.manual);

  function handleSwitchChange() {
    if (recordMode === RecordMode.manual) {
      setRecordMode(RecordMode.bulk);
    } else {
      setRecordMode(RecordMode.manual);
    }
  }

  return (
    <Flex
      p={26}
      borderRadius="20px"
      width="95%"
      gap={2}
      flexDirection="column"
      boxShadow="3px 4px 12px rgba(0, 0, 0, 0.2)"
    >
      <Flex w="100%" alignItems={"center"}>
        <Heading as="h1" fontSize="1.2em" fontWeight={700}>
          {recordMode === RecordMode.bulk && "Bulk"} Record Conversions
        </Heading>
        <Spacer />
        {/* Disable bulk mode for now */}

        {/* <Text>Manual mode</Text>
        <Switch onChange={handleSwitchChange} mx={4} />
        <Text>Bulk mode</Text> */}
      </Flex>

      {recordMode === RecordMode.manual ? (
        <ManualRecordConversionsWidgetContent />
      ) : (
        <BulkRecordConversionsWidgetContent />
      )}
    </Flex>
  );
};

export default RecordConversionsWidget;
