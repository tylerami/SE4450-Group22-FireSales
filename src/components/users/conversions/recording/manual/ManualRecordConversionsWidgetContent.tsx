import React, { useState, useCallback, useMemo } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import RecordConversionTile from "./ManualRecordConversionTile";
import { AddIcon } from "@chakra-ui/icons";
import {
  Conversion,
  ConversionAttachmentGroup,
  conversionsWithLink,
  filterConversionsByDateInterval,
} from "models/Conversion";
import { CompensationGroup } from "models/CompensationGroup";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { RiSubtractLine } from "react-icons/ri";
import useSuccessNotification from "components/utils/SuccessNotification";
import useErrorNotification from "components/utils/ErrorNotification";
import { ConversionType } from "models/enums/ConversionType";
import { firstDayOfCurrentMonth } from "models/utils/Date";

const ManualRecordConversionsWidgetContent = ({
  conversions: existingConversions,
  compGroupHistory,
  refresh,
}: {
  conversions: Conversion[];
  compGroupHistory: CompensationGroup[];
  refresh: () => void;
}) => {
  // SERVICES
  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  // CONVERSION STATE
  // conversions is an object with keys of row numbers and values of Conversion objects
  // undefined values indicate that the conversion is not valid -->  this is why a map is used instead of an array
  const [conversionsGroups, setConversionsGroups] = useState<
    Record<number, ConversionAttachmentGroup | undefined>
  >({
    0: undefined,
  });

  const setConversionGroup = useCallback(
    (
      rowNumber: number,
      conversionGroup: ConversionAttachmentGroup | null | undefined
    ) => {
      if (conversionGroup === null) {
        conversionGroup = undefined;
      }
      setConversionsGroups((currentConversions) => {
        return {
          ...currentConversions,
          [rowNumber]: conversionGroup as ConversionAttachmentGroup | undefined,
        };
      });
    },
    []
  );

  // ERROR HANDLING

  const [globalErrorText, setGlobalErrorText] = useState<string>("");

  // This is a map of row numbers to error messages
  const [errorsByRow, setErrorsByRow] = useState<
    Record<number, string | undefined>
  >({});

  // Current compensation group
  const latestCompGroup: CompensationGroup | null = useMemo(
    () => (compGroupHistory.length > 0 ? compGroupHistory[0] : null),
    [compGroupHistory]
  );

  const retentionIncentivesExceedMonthlyLimit = () => {
    for (const incentive of latestCompGroup?.retentionIncentives ?? []) {
      const usedIncentivesThisMonth: number = filterConversionsByDateInterval(
        existingConversions
          .filter((conv) => conv.type === ConversionType.retentionIncentive)
          .filter((conv) => conv.affiliateLink.clientId === incentive.clientId),
        {
          fromDate: firstDayOfCurrentMonth(),
        }
      ).length;

      const newIncentives = Object.values(conversionsGroups)
        .map((group) => group?.conversion)
        .filter((conv) => conv !== undefined)
        .filter((conv) => conv!.affiliateLink.clientId === incentive.clientId)
        .filter(
          (conv) => conv!.type === ConversionType.retentionIncentive
        ).length;

      if (usedIncentivesThisMonth + newIncentives > incentive.monthlyLimit) {
        return true;
      }
    }
    return false;
  };

  const affiliateLinkConversionsExceedMonthlyLimit = () => {
    for (const link of latestCompGroup?.affiliateLinks ?? []) {
      if (!link.monthlyLimit) {
        continue;
      }
      const usedConversionsThisMonth: number = filterConversionsByDateInterval(
        conversionsWithLink(existingConversions, link),
        {
          fromDate: firstDayOfCurrentMonth(),
        }
      ).length;

      const newConversions = Object.values(conversionsGroups)
        .map((group) => group?.conversion)
        .filter((conv) => conv !== undefined)
        .filter((conv) => conv!.affiliateLink.id === link.id).length;

      if (usedConversionsThisMonth + newConversions > link.monthlyLimit) {
        return true;
      }
    }
  };

  const checkAllConversionsValid = (): boolean => {
    let foundError = false;

    for (let i = 0; i < rowCount; i++) {
      if (!conversionsGroups[i]) {
        setRowError(i, "Please fill out all fields");
        foundError = true;
      } else {
        setRowError(i, undefined);
      }
    }

    if (retentionIncentivesExceedMonthlyLimit()) {
      setGlobalErrorText(
        "Ensure that retention incentives do not exceed any monthly limits."
      );
      foundError = true;
    }

    if (affiliateLinkConversionsExceedMonthlyLimit()) {
      setGlobalErrorText(
        "Ensure that conversions do not exceed any monthly limits."
      );
      foundError = true;
    }

    return !foundError;
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

  const showError = useErrorNotification();

  // This function is called when the user clicks the "Record Conversions" button
  // It will record all conversions that are valid
  async function recordConversions() {
    if (loading) return;

    if (!checkAllConversionsValid()) {
      showError({
        message: "Error recording conversions.",
      });
      return;
    }

    const conversionAttachmentGroups: ConversionAttachmentGroup[] =
      Object.values(conversionsGroups).filter(
        (group) => group !== undefined
      ) as ConversionAttachmentGroup[];

    setLoading(true);
    const result = await conversionService.createBulk(
      conversionAttachmentGroups
    );

    if (result) {
      showSuccess({
        message: `Successfully recorded ${result.length} conversions`,
      });
      resetAllRows();
      refresh();
    }

    setLoading(false);
  }

  const resetAllRows = () => {
    setRowCount(0);
    setConversionsGroups({});
    setErrorsByRow({});
    setTimeout(() => {
      setRowCount(1);
    }, 100);
  };

  // ROW COUNT
  const [rowCount, setRowCount] = useState(1);

  const addRow = useCallback(() => {
    setRowCount((currentRowCount) => currentRowCount + 1);
  }, []);

  const deleteRow = useCallback(() => {
    setRowError(rowCount - 1, undefined);
    setConversionGroup(rowCount - 1, undefined);
    setRowCount((currentRowCount) => currentRowCount - 1);
  }, [rowCount, setConversionGroup]);

  const [loading, setLoading] = useState<boolean>(false);

  const showSuccess = useSuccessNotification();

  return (
    <React.Fragment>
      <Box h={2} />

      {Array.from({ length: rowCount }, (_, i) => (
        <Box key={`${i}-box`}>
          <RecordConversionTile
            conversions={existingConversions}
            compGroupHistory={compGroupHistory}
            errorText={errorsByRow[i]}
            rowIndex={i + 1}
            setConversionGroup={(conversion) =>
              setConversionGroup(i, conversion)
            }
            key={i}
          />
        </Box>
      ))}

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
      <Text alignSelf={"center"} fontSize="sm" color="red">
        {globalErrorText}
      </Text>
    </React.Fragment>
  );
};

export default ManualRecordConversionsWidgetContent;
