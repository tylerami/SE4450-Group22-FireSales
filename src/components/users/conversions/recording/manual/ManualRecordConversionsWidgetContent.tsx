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
import { error } from "console";

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

  const [conversionValidity, setConversionValidity] = useState<
    Record<number, boolean>
  >({});

  const [loading, setLoading] = useState<boolean>(false);

  function errorsPresent() {
    return Object.values(errorsByRow).some((error) => error !== undefined);
  }

  function allConversionsValid() {
    console.log(conversionValidity);
    return (
      Object.values(conversionValidity).every((valid) => valid ?? true) &&
      !errorsPresent()
    );
  }

  function setConversionValid(rowNumber: number, valid: boolean) {
    setConversionValidity((currentValid) => {
      return {
        ...currentValid,
        [rowNumber]: valid,
      };
    });
  }

  const showSuccess = useSuccessNotification();

  const reset = () => {
    console.log("resetting");
    setRowCount(0);
    setConversions({});
    setErrorsByRow({});
    setConversionValidity({});
    setTimeout(() => {
      setRowCount(1);
    }, 100);
  };

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
    setConversionValidity((currentValidity) => {
      const newValidity = { ...currentValidity };
      delete newValidity[rowCount - 1];
      return newValidity;
    });
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

  const checkConversionErrors = (): boolean => {
    let foundError = false;

    if (!allConversionsValid()) {
      foundError = true;
    }

    for (const [row, isValid] of Object.entries(conversionValidity)) {
      if (!isValid) {
        setRowError(Number(row), "Please fill out all fields");
        foundError = true;
      }
    }

    for (let i = 0; i < rowCount; i++) {
      if (!conversions[i]) {
        setRowError(i, "Please fill out all fields");
        foundError = true;
      } else {
        setRowError(i, undefined);
      }
    }

    if (!foundError) {
      setErrorsByRow({});
      setConversionValidity({});
    }

    return !foundError;
  };

  async function recordConversions() {
    if (loading) return;

    if (!checkConversionErrors()) {
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
    console.log("result", result);
    if (result) {
      showSuccess({
        message: `Successfully recorded ${result.length} conversions`,
      });
      reset();
    }
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
        key={i}
        setIsValid={(bool) => setConversionValid(i, bool)}
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
        {"Record Conversions"}
      </Button>
    </React.Fragment>
  );
};

export default ManualRecordConversionsWidgetContent;
