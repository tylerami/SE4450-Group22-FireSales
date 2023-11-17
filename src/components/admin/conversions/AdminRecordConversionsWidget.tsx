import React, { useContext, useState } from "react";
import { Button, Heading, Input, InputGroup, Spinner } from "@chakra-ui/react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { Conversion, ConversionAttachmentGroup } from "models/Conversion";
import { filterCsvHeaders, getCsvFileContent } from "utils/File";
import { generateSampleClients } from "__mocks__/models/Client.mock";
import { findClosestMatch } from "utils/String";
import { Client } from "models/Client";
import { ReferralLinkType } from "models/enums/ReferralLinkType";
import { AffiliateLink } from "models/AffiliateLink";
import { Customer } from "models/Customer";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "utils/DependencyInjection";
import { parseDateString } from "utils/Date";
import AdminRecordConversionsProcessedTable from "./AdminRecordConversionsProcessedTable";
import AdminRecordConversionsInstructions from "./AdminRecordConversionsInstructions";
import { UnassignedConversion } from "models/UnassignedConversion";
import { AffiliateDeal } from "@models/AffiliateDeal";

type Props = {};

const AdminRecordConversionsWidgetContent = (props: Props) => {
  // Services
  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  // State
  const [errorText, setErrorText] = useState(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const [attachments, setAttachments] = useState<File[]>([]);
  const [conversionsByNumber, setConversionsByNumber] = useState<Record<
    number,
    UnassignedConversion
  > | null>(null);
  const [assignmentCode, setAssignmentCode] = useState("");

  // Process the CSV file into conversions
  const processCsvFile = async (
    csvFile: File
  ): Promise<Record<number, UnassignedConversion>> => {
    setProcessing(true);
    let csvContent = await getCsvFileContent(csvFile);

    const expectedHeaders = [
      "number",
      "date",
      "sportsbook",
      "type",
      "size",
      "name",
    ];
    csvContent = filterCsvHeaders({
      csvContent,
      expectedHeaders,
      keywordMatchThreshold: 3,
    });
    console.log(csvContent);

    const mapCsvRowToConversion = (
      csvRow: string
    ): UnassignedConversion | null => {
      const values: string[] = csvRow.split(",");
      const clients: Client[] = generateSampleClients(5);

      const dateString: string = values[1];
      const dateOccurred: Date = parseDateString(dateString, "yyyy-mm-dd");

      const sportsbookName: string = values[2];
      const typeString: string = values[3]?.toLowerCase();
      const referralType: ReferralLinkType = typeString.includes("sports")
        ? ReferralLinkType.sports
        : ReferralLinkType.casino;

      const matchedClient: Client | null = findClosestMatch<Client>(
        sportsbookName,
        clients,
        (client) => client.name
      );
      if (matchedClient === null) {
        console.log("No client match");
        return null;
      }

      const betSize = Number(values[4]);
      const commission = Number(values[5]);
      const customerName = values[6];

      const matchedAffiliateDeal: AffiliateDeal | undefined = Object.values(
        matchedClient.affiliateDeals
      ).find(
        (deal) =>
          deal.clientId === matchedClient.id && deal.type === referralType
      );
      if (matchedAffiliateDeal === undefined) {
        console.log("No affiliate deal match");
        return null;
      }

      const affiliateLink: AffiliateLink = new AffiliateLink({
        clientId: matchedClient.id,
        clientName: matchedClient.name,
        type: referralType,
        link: matchedAffiliateDeal.link,
        commission,
        minBetSize: betSize,
        cpa: matchedAffiliateDeal.cpa,
      });

      const conversion: UnassignedConversion =
        UnassignedConversion.fromManualInput({
          dateOccurred,
          assignmentCode,
          affiliateLink,
          amount: betSize,
          customer: new Customer({
            fullName: customerName,
          }),
        });

      return conversion;
    };

    const rows: string[] = csvContent.split("\n");
    const conversionsByNumber: Record<number, UnassignedConversion> = {};

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const convNumber = Number(row.split(",")[0]);

      const conversion = mapCsvRowToConversion(row.replace("\r", ""));
      console.log(`Conversion ${convNumber}: `, conversion);
      if (conversion !== null) {
        conversionsByNumber[convNumber] = conversion;
      }

      if (convNumber !== i + 1) {
        console.log("Conversion number mismatch");
      }
    }

    console.log(conversionsByNumber);

    setConversionsByNumber(conversionsByNumber);
    setProcessing(false);
    return conversionsByNumber;
  };

  type UnassignedConversionAttachmentGroup = {
    conversion: UnassignedConversion;
    attachments: File[];
  };

  // Create groups of conversions with attachments for recording
  const createConversionGroups = async (): Promise<
    UnassignedConversionAttachmentGroup[]
  > => {
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

    const conversionGroups: UnassignedConversionAttachmentGroup[] = [];
    for (const convNumber of Object.keys(conversionsByNumber)) {
      const conversion: UnassignedConversion = conversionsByNumber[convNumber];
      const attachments = getAttachmentsForConversion(Number(convNumber));
      const conversionGroup: UnassignedConversionAttachmentGroup = {
        conversion,
        attachments,
      };
      conversionGroups.push(conversionGroup);
    }

    return conversionGroups;
  };

  // Record the conversions once ready
  async function recordConversions() {
    let conversionGroups: UnassignedConversionAttachmentGroup[];
    try {
      conversionGroups = await createConversionGroups();
    } catch (e: any) {
      console.log(e);
      setErrorText(e.message);
      return;
    }

    const result = await conversionService.createBulkUnassigned(
      conversionGroups
    );
    if (result !== undefined && result !== null) {
      setErrorText(null);
    } else {
      setErrorText(result);
    }
  }

  // Handling input changes

  const triggerCsvUpload = () => {
    if (csvFile !== null) {
      console.log("Removing CSV file");
      setCsvFile(null);
      setConversionsByNumber(null);
      return;
    }
    const fileInput = document.getElementById("csv-upload");
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const handleCsvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      setCsvFile(event.target.files[0]);
      processCsvFile(event.target.files[0]);
    } else {
      console.log("No file uploaded");
      setCsvFile(null);
      setConversionsByNumber(null);
    }
  };

  const triggerAttachmentsUpload = () => {
    if (attachments.length > 0) {
      setAttachments([]);
      return;
    }
    const fileInput = document.getElementById("attachments-upload");
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const handleAttachementsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setAttachments(Array.from(event.target.files));
    } else {
      setAttachments([]);
    }
  };

  const getAttachmentNumber = (attachment: File): number => {
    const numString = attachment.name.split("_")[0].replace("conv", "");
    const num = Number.parseInt(numString);
    return num;
  };

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
      </Flex>
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
      <Text>
        Enter an assignment code that a user can use to claim these conversions:
      </Text>
      <Input
        focusBorderColor="#ED7D31"
        placeholder="Assignment Code..."
        value={assignmentCode}
        onChange={(e) => setAssignmentCode(e.target.value)}
      />
      <Box h={2} />
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
              onChange={handleCsvChange}
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
              onChange={handleAttachementsChange}
              id="attachments-upload"
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
    </Flex>
  );
};

export default AdminRecordConversionsWidgetContent;
