import React, { useEffect, useState } from "react";
import {
  Button,
  Heading,
  Input,
  InputGroup,
  Spacer,
  Spinner,
} from "@chakra-ui/react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { Client } from "src/models/Client";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import AdminRecordConversionsProcessedTable from "./AdminRecordConversionsProcessedTable";
import AdminRecordConversionsInstructions from "./AdminRecordConversionsInstructions";
import { ClientService } from "services/interfaces/ClientService";
import useSuccessNotification from "components/utils/SuccessNotification";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  filterCsvHeaders,
  getCsvFileContent as getCsvRows,
  mapCsvRowToConversion,
} from "src/models/utils/CsvParser";
import { Conversion, ConversionAttachmentGroup } from "src/models/Conversion";

type Props = {};

const AdminRecordConversionsWidgetContent = (props: Props) => {
  // SERVICES
  const conversionService: ConversionService =
    DependencyInjection.conversionService();
  const clientClient: ClientService = DependencyInjection.clientService();

  // STATE
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [errorText, setErrorText] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const [attachments, setAttachments] = useState<File[]>([]);
  const [conversionsByNumber, setConversionsByNumber] = useState<Record<
    number,
    Conversion
  > | null>(null);
  //const [assignmentCode, setAssignmentCode] = useState("");

  const [clients, setClients] = useState<Client[]>([]);

  // CLIENT DATA FETCHING
  useEffect(() => {
    const fetchClients = async () => {
      const clients = await clientClient.getAll();
      setClients(clients);
    };

    fetchClients();
  }, [clientClient]);

  // CSV PROCESSING
  async function processCsvFile(
    csvFile: File
  ): Promise<Record<number, Conversion>> {
    setProcessing(true);
    let csvContentRows: string[][] = await getCsvRows(csvFile);

    const firstCellContent = csvContentRows[0][0];
    console.log(
      "First cell content: " + firstCellContent,
      Number(firstCellContent)
    );

    const firstColumnIsNumber = !isNaN(Number(firstCellContent));

    console.log("First column is number: " + firstColumnIsNumber);

    const expectedHeaders = [
      ...(firstColumnIsNumber ? ["number"] : []),
      "date",
      "sportsbook",
      "type",
      "size",
      "name",
      "affiliate",
    ];
    csvContentRows = filterCsvHeaders({
      csvContentRows,
      expectedHeaders,
      keywordMatchThreshold: 3,
    });

    // MAIN LOOP FOR CSV ROW PROCESSING
    const conversionsByNumber: Record<number, Conversion> = {};

    for (let i = 0; i < csvContentRows.length; i++) {
      const csvRow: string[] = csvContentRows[i];

      const convNumber = firstColumnIsNumber ? Number(csvRow[0]) : i + 1;

      const conversion = mapCsvRowToConversion({
        csvRow,
        clients,
      });
      if (conversion !== null) {
        conversionsByNumber[convNumber] = conversion;
      }

      if (convNumber !== i + 1) {
        console.log("Conversion number mismatch");
      }
    }

    setProcessing(false);
    setConversionsByNumber(conversionsByNumber);
    return conversionsByNumber;
  }

  // CONVERSION RECORDING
  const showSuccess = useSuccessNotification();

  async function recordConversions() {
    setProcessing(true);

    let conversionGroups: ConversionAttachmentGroup[];
    try {
      conversionGroups = await createConversionGroups();
    } catch (e: any) {
      console.log(e);
      setErrorText(e.message);
      return;
    }

    // create bulk unassigned
    const result = await conversionService.createBulk(conversionGroups);

    if (result !== undefined && result !== null) {
      setErrorText(null);
      handleCsvChange(null);
      showSuccess({
        message: `Successfully recorded ${result.length} conversions`,
      });
    } else {
      setErrorText(result);
    }
    setProcessing(false);
  }

  // CONVERSION GROUP CREATION
  const createConversionGroups = (): ConversionAttachmentGroup[] => {
    if (conversionsByNumber == null) {
      throw new Error("No conversions to record");
    }

    const getAttachmentNumber = (attachment: File): number => {
      const numString = attachment.name.split("_")[0].replace("conv", "");
      const num = Number.parseInt(numString);
      return num;
    };

    const getAttachmentsForConversion = (convNumber: number): File[] => {
      const attachmentsForConv: File[] = [];
      for (let attachment of attachments) {
        const attachmentNumber = getAttachmentNumber(attachment);
        if (attachmentNumber === convNumber) {
          attachmentsForConv.push(attachment);
        }
      }
      return attachmentsForConv;
    };

    const conversionGroups: ConversionAttachmentGroup[] = [];
    for (const convNumber of Object.keys(conversionsByNumber)) {
      let conversion: Conversion = conversionsByNumber[convNumber];
      const attachments = getAttachmentsForConversion(Number(convNumber));
      const conversionGroup: ConversionAttachmentGroup = {
        conversion,
        attachments,
      };
      conversionGroups.push(conversionGroup);
    }

    return conversionGroups;
  };

  // INPUT HANDLING

  const triggerCsvUpload = () => {
    if (csvFile !== null) {
      console.log("Removing CSV file");
      handleCsvChange(null);
      return;
    }
    console.log("Triggering CSV upload");
    const fileInput = document.getElementById("csv-upload");
    if (fileInput) {
      console.log("Clicking file input");
      (fileInput as HTMLInputElement).value = "";
      (fileInput as HTMLInputElement).click();
    }
  };

  const handleCsvChange = (
    event: React.ChangeEvent<HTMLInputElement> | null
  ) => {
    console.log(event);
    const csv = Array.from(event?.target.files ?? [])[0];
    console.log(csv);
    if (csv && event) {
      setCsvFile(csv);
      processCsvFile(csv);
    } else {
      console.log("No file uploaded");
      setCsvFile(null);
      setConversionsByNumber(null);
    }
  };

  const triggerAttachmentsUpload = () => {
    if (attachments.length > 0) {
      handleAttachementsChange(null);
      return;
    }
    const fileInput = document.getElementById("attachments-upload");
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const handleAttachementsChange = (files: FileList | null) => {
    if (files) {
      setAttachments(Array.from(files));
    } else {
      setAttachments([]);
    }
  };

  // NAMED VARIABLES FOR CONDITIONAL RENDERING
  const csvUploaded = csvFile !== null;
  const attachmentsUploaded = attachments.length > 0;

  const conversions =
    conversionsByNumber == null ? null : Object.values(conversionsByNumber);

  const conversionsReadyToRecord =
    !processing && conversions !== null && conversions.length > 0;

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      width={"95%"}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
      gap={2}
    >
      <Flex justifyContent={"start"} gap={4}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          Manually Upload Conversions
        </Heading>
        <Spacer />
        <Button
          width={"10em"}
          onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
          leftIcon={collapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
        >
          {collapsed ? "Expand" : "Collapse"}
        </Button>
      </Flex>
      {!collapsed && (
        <React.Fragment>
          {processing ? (
            <Spinner size="xl" />
          ) : conversions != null ? (
            <AdminRecordConversionsProcessedTable
              attachments={attachments}
              conversionsByNumber={conversionsByNumber}
            />
          ) : (
            <AdminRecordConversionsInstructions />
          )}

          <Box h={2} />
          {/* <Text>
            Enter an assignment code that a user can use to claim these
            conversions:
          </Text>
          <Input
            focusBorderColor="#ED7D31"
            placeholder="Assignment Code..."
            value={assignmentCode}
            onChange={(e) => setAssignmentCode(e.target.value)}
          />
          <Box h={2} /> */}
          <Flex gap={4} justifyContent={"space-evenly"} alignItems={"start"}>
            <InputGroup width={"full"}>
              <Button
                colorScheme={csvUploaded ? "red" : undefined}
                size="md"
                w="100%"
                onClick={triggerCsvUpload}
              >
                <Input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={(e) => {
                    console.log("hello");
                    handleCsvChange(e);
                  }}
                  id="csv-upload"
                />
                {csvUploaded ? "Remove " + csvFile.name : "Upload CSV"}
              </Button>
            </InputGroup>

            <InputGroup width={"full"}>
              <Button
                colorScheme={attachmentsUploaded ? "red" : undefined}
                size="md"
                w="100%"
                onClick={triggerAttachmentsUpload}
              >
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={(e) => handleAttachementsChange(e.target.files)}
                  id="attachments-upload"
                  name="attachments-upload"
                />
                {attachmentsUploaded
                  ? "Remove " + attachments.length + " attachments"
                  : "Upload Attachments"}
              </Button>
            </InputGroup>
          </Flex>
          <Box />
          <Button
            isDisabled={!csvFile || !conversionsReadyToRecord}
            size="lg"
            isLoading={processing}
            colorScheme="orange"
            onClick={recordConversions}
          >
            {csvFile
              ? conversionsReadyToRecord
                ? "Record Conversions"
                : "Fix Errors"
              : "Upload CSV to Record Conversions"}
          </Button>
          {errorText && <Text color={"red"}>{errorText}</Text>}
        </React.Fragment>
      )}
    </Flex>
  );
};

export default AdminRecordConversionsWidgetContent;
