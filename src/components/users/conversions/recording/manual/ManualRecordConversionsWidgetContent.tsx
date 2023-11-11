import React, { useState, useCallback } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import RecordConversionTile from "./ManualRecordConversionTile";
import { AddIcon } from "@chakra-ui/icons";
import {
  Conversion,
  ConversionAttachmentGroup,
} from "../../../../../models/Conversion";
import { CompensationGroup } from "@models/CompensationGroup";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "utils/DependencyInjection";

// Since the Props type is empty, we can omit it and also the props parameter
const ManualRecordConversionsWidgetContent = ({
  compensationGroup,
}: {
  compensationGroup: CompensationGroup;
}) => {
  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const [rowCount, setRowCount] = useState(1);
  // conversions is an object with keys of row numbers and values of Conversion objects
  const [conversions, setConversions] = useState<
    Record<number, ConversionAttachmentGroup | undefined>
  >({});

  const [errorsByRow, setErrorsByRow] = useState<
    Record<number, string | undefined>
  >({});

  const [loading, setLoading] = useState<boolean>(false);

  function resetErrors() {
    setErrorsByRow({});
  }

  function setRowError(rowNumber: number, error: string | null | undefined) {
    if (error === null) {
      error = undefined;
    }
    setErrorsByRow((currentErrors) => {
      return {
        ...currentErrors,
        [rowNumber]: error as string | undefined,
      };
    });
  }

  const addRow = useCallback(() => {
    setRowCount((currentRowCount) => currentRowCount + 1);
  }, []);

  const deleteRow = useCallback(() => {
    setRowCount((currentRowCount) => currentRowCount - 1);
  }, []);

  const setConversion = useCallback(
    (
      rowNumber: number,
      conversion: ConversionAttachmentGroup | null | undefined
    ) => {
      if (conversion === null) {
        conversion = undefined;
      }
      setConversions((currentConversions) => {
        return {
          ...currentConversions,
          [rowNumber]: conversion as ConversionAttachmentGroup | undefined,
        };
      });
    },
    []
  );

  async function recordConversions() {
    if (loading) return;

    resetErrors();
    let foundError = false;
    for (let i = 0; i <= rowCount; i++) {
      if (!conversions[i]) {
        setRowError(i, "Please fill out all fields");
        foundError = true;
      }
    }
    if (foundError) {
      return;
    }

    const conversionAttachmentGroups: ConversionAttachmentGroup[] =
      Object.values(conversions).filter(
        (group) => group !== undefined
      ) as ConversionAttachmentGroup[];

    setLoading(true);
    const result = await conversionService.createBulk(
      conversionAttachmentGroups
    );
    setLoading(false);
  }

  // Generate an array of RecordConversionTile components
  const recordConversionTiles = Array.from({ length: rowCount }, (_, index) => (
    <Box>
      <RecordConversionTile
        compensationGroup={compensationGroup}
        errorText={errorsByRow[index]}
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
      <Button
        isLoading={loading}
        size="lg"
        colorScheme="orange"
        onClick={recordConversions}
      >
        Record Conversions
      </Button>
    </React.Fragment>
  );
};

export default ManualRecordConversionsWidgetContent;
