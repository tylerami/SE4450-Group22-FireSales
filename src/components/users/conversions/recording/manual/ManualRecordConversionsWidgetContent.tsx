import React, { useState, useCallback } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import RecordConversionTile from "./ManualRecordConversionTile";
import { AddIcon } from "@chakra-ui/icons";
import {
  Conversion,
  ConversionAttachmentGroup,
} from "../../../../../models/Conversion";
import { CompensationGroup } from "@models/CompensationGroup";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "utils/DependencyInjection";
import { RiSubtractLine } from "react-icons/ri";
import useSuccessNotification from "components/utils/SuccessNotification";

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

  const showSuccess = useSuccessNotification();

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
    setRowError(rowCount - 1, undefined);
    setRowCount((currentRowCount) => currentRowCount - 1);
  }, [rowCount]);

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
    for (let i = 0; i < rowCount; i++) {
      if (!conversions[i]) {
        setRowError(i, "Please fill out all fields");
        foundError = true;
      }
    }
    if (foundError) {
      console.log(errorsByRow);
      return;
    } else {
      console.log("no conversion  errors");
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
  const recordConversionTiles = Array.from({ length: rowCount }, (_, i) => (
    <Box key={`${i}-box`}>
      <RecordConversionTile
        compensationGroup={compensationGroup}
        errorText={errorsByRow[i]}
        rowIndex={i + 1}
        setConversionGroup={(conversion) => setConversion(i, conversion)}
        deleteRow={deleteRow}
        key={i}
      />
    </Box>
  ));

  return (
    <React.Fragment>
      <Box h={2} />

      {recordConversionTiles}

      <Box h={0} />

      <Flex gap={4} w="100%">
        <Button w="full" leftIcon={<AddIcon />} onClick={addRow}>
          Add Row
        </Button>
        {rowCount > 1 && (
          <Button minW="40%" leftIcon={<RiSubtractLine />} onClick={deleteRow}>
            Remove Row
          </Button>
        )}
      </Flex>
      <Box />
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
