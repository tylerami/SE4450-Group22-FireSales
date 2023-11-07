import React, { useState, useCallback } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import RecordConversionTile from "./RecordConversionTile";
import { AddIcon } from "@chakra-ui/icons";
import { Sale } from "../../../models/sale";

// Since the Props type is empty, we can omit it and also the props parameter
const RecordConversionsWidget = () => {
  const [rowCount, setRowCount] = useState(1);
  // conversions is an object with keys of row numbers and values of Sale objects
  const [conversions, setConversions] = useState<Record<number, Sale>>({});

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
    <Flex
      p={26}
      borderRadius="20px"
      width="95%"
      gap={2}
      flexDirection="column"
      boxShadow="3px 4px 12px rgba(0, 0, 0, 0.2)"
    >
      <Heading as="h1" fontSize="1.2em" fontWeight={700}>
        Record Conversions
      </Heading>

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
    </Flex>
  );
};

export default RecordConversionsWidget;
