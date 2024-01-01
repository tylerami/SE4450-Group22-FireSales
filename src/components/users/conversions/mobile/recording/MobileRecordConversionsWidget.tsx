import React, { useState, useContext, useEffect, useCallback } from "react";
import { Box, Button, Heading, Spacer, Spinner } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { CompensationGroup } from "models/CompensationGroup";
import { UserContext } from "components/auth/UserProvider";
import { AddIcon } from "@chakra-ui/icons";
import useSuccessNotification from "components/utils/SuccessNotification";
import { ConversionService } from "services/interfaces/ConversionService";
import { Conversion, ConversionAttachmentGroup } from "models/Conversion";
import useErrorNotification from "components/utils/ErrorNotification";
import MobileRecordConversionTile from "./MobileRecordConversionsTile";
import { RiSubtractLine } from "react-icons/ri";

type Props = {
  refresh: () => void;
  conversions: Conversion[];
};

const MobileRecordConversionsWidget = ({
  refresh,
  conversions: existingConversions,
}: Props) => {
  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const [compensationGroup, setCompensationGroup] =
    useState<CompensationGroup | null>(null);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchCompensationGroup = async () => {
      const compGroupId = currentUser?.compensationGroupId;
      if (!compGroupId) {
        return;
      }
      const compGroup = await compGroupService.get(compGroupId);
      setCompensationGroup(compGroup);
    };

    fetchCompensationGroup();
  }, [compGroupService, currentUser?.compensationGroupId]);

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
  // This is a map of row numbers to error messages
  const [errorsByRow, setErrorsByRow] = useState<
    Record<number, string | undefined>
  >({});

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
    <Flex
      p={6}
      borderRadius="20px"
      width="100%"
      gap={2}
      flexDirection="column"
      boxShadow="3px 4px 12px rgba(0, 0, 0, 0.2)"
    >
      <Flex w="100%" alignItems={"center"}>
        <Heading as="h1" fontSize="1.2em" fontWeight={700}>
          Record Conversions
        </Heading>
        <Spacer />

        {/* button to minimize / maximize the widget, with chevron icons  */}
      </Flex>

      <React.Fragment>
        {compensationGroup ? (
          <React.Fragment>
            <Box h={2} />

            {Array.from({ length: rowCount }, (_, i) => (
              <Box key={`${i}-box`}>
                <MobileRecordConversionTile
                  conversions={existingConversions}
                  compensationGroup={compensationGroup}
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

            <Flex gap={4} direction={"column"} w="100%">
              <Button w="full" leftIcon={<AddIcon />} onClick={addRow}>
                Add Row
              </Button>
              {rowCount > 1 && (
                <Button
                  minW="40%"
                  leftIcon={<RiSubtractLine />}
                  onClick={deleteRow}
                >
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
        ) : (
          <Flex
            w="100%"
            h="10em"
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Spinner size="lg" />
          </Flex>
        )}
      </React.Fragment>
    </Flex>
  );
};

export default MobileRecordConversionsWidget;
