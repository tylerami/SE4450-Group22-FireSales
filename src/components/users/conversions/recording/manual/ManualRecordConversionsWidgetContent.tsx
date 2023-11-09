import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Switch,
  Text,
} from "@chakra-ui/react";
import RecordConversionTile from "./ManualRecordConversionTile";
import { AddIcon } from "@chakra-ui/icons";
import { Conversion } from "../../../../../models/Conversion";

type Props = {};

// Since the Props type is empty, we can omit it and also the props parameter
const ManualRecordConversionsWidgetContent = (props: Props) => {
  const [rowCount, setRowCount] = useState(1);
  // conversions is an object with keys of row numbers and values of Conversion objects
  const [conversions, setConversions] = useState<Record<number, Conversion>>(
    {}
  );

  const [errorText, setErrorText] = useState(null);

  function resetError() {
    setErrorText(null);
  }

  const addRow = useCallback(() => {
    setRowCount((currentRowCount) => currentRowCount + 1);
  }, []);

  const deleteRow = useCallback(() => {
    setRowCount((currentRowCount) => currentRowCount - 1);
  }, []);

  const setConversion = useCallback((rowNumber, conversion) => {
    setConversions((currentConversions) => {
      return { ...currentConversions, [rowNumber]: conversion };
    });
  }, []);

  function recordConversions() {
    // record conversions
  }

  // Generate an array of RecordConversionTile components
  const recordConversionTiles = Array.from({ length: rowCount }, (_, index) => (
    <Box my={2}>
      <RecordConversionTile
        rowIndex={index + 1}
        setConversion={(conversion) => setConversion(index, conversion)}
        deleteRow={deleteRow}
        key={index}
      />
    </Box>
  ));

  return (
    <React.Fragment>
      <Box h={2} />

      {recordConversionTiles}

      <Box h={2} />

      <Button leftIcon={<AddIcon />} onClick={addRow}>
        Add Row
      </Button>
      <Button size="lg" colorScheme="orange" onClick={recordConversions}>
        Record Conversions
      </Button>
      {errorText && <Text color={"red"}>{errorText}</Text>}
    </React.Fragment>
  );
};

export default ManualRecordConversionsWidgetContent;
