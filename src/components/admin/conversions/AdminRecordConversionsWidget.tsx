import React, { useContext, useState } from "react";
import { Button, Input, InputGroup, Spinner } from "@chakra-ui/react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { Conversion, ConversionAttachmentGroup } from "models/Conversion";
import { filterCsvHeaders, getCsvFileContent } from "utils/File";
import { generateSampleClients } from "__mocks__/models/Client.mock";
import { findClosestMatch } from "utils/String";
import { Client } from "models/Client";
import { UserContext } from "components/auth/UserProvider";
import { CompensationGroup } from "models/CompensationGroup";
import { ReferralLinkType } from "models/enums/ReferralLinkType";
import { AffiliateLink } from "models/AffiliateLink";
import { Customer } from "models/Customer";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "utils/DependencyInjection";
import { parseDateString } from "utils/Date";
import AdminRecordConversionsProcessedTable from "./AdminRecordConversionsProcessedTable";
import AdminRecordConversionsInstructions from "./AdminRecordConversionsInstructions";

type Props = {
  compensationGroup: CompensationGroup | null;
};

const BulkRecordConversionsWidgetContent = ({ compensationGroup }: Props) => {
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
    Conversion
  > | null>(null);
  const [assignmentCode, setAssignmentCode] = useState("");

  const { currentUser } = useContext(UserContext);

  // Process the CSV file into conversions
  const processCsvFile = async (
    csvFile: File
  ): Promise<Record<number, Conversion>> => {
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

    const mapCsvRowToConversion = (csvRow: string): Conversion | null => {
      const userId = currentUser?.uid;
      if (!userId || compensationGroup === null) {
        console.log("No user or compensation group");
        return null;
      }

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

      const amount = Number(values[4]);
      const customerName = values[5];

      const matchedAffiliateLink: AffiliateLink | undefined =
        compensationGroup.affiliateLinks.find(
          (affiliateLink) =>
            affiliateLink.clientId === matchedClient.id &&
            affiliateLink.type === referralType
        );

      if (matchedAffiliateLink === undefined) {
        console.log("No affiliate link match");
        return null;
      }

      const conversion: Conversion = Conversion.fromManualInput({
        dateOccurred,
        userId,
        affiliateLink: matchedAffiliateLink,
        compensationGroupId: compensationGroup.id,
        amount,
        customer: new Customer({
          fullName: customerName,
        }),
      });

      return conversion;
    };

    const rows: string[] = csvContent.split("\n");
    const conversionsByNumber: Record<number, Conversion> = {};

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

  // Create groups of conversions with attachments for recording
  const createConversionGroups = async (): Promise<
    ConversionAttachmentGroup[]
  > => {
    if (conversionsByNumber == null) {
      throw new Error("No conversions to record");
    }

    const getAttachmentsForConversion = (convNumber: number): File[] => {
      const attachmentsForConv: File[] = [];
      for (let attachment of attachments) {
        const attachmentName = attachment.name;
        const attachmentNumber = Number(
          attachmentName.split("_")[0].replace("conv", "")
        );

        if (attachmentNumber === convNumber) {
          attachmentsForConv.push(attachment);
        }
      }
      return attachmentsForConv;
    };

    const conversionGroups: ConversionAttachmentGroup[] = [];
    for (const convNumber of Object.keys(conversionsByNumber)) {
      const conversion = conversionsByNumber[convNumber];
      const attachments = getAttachmentsForConversion(Number(convNumber));
      const conversionGroup: ConversionAttachmentGroup = {
        conversion,
        attachments,
      };
      conversionGroups.push(conversionGroup);
    }

    setProcessing(false);

    return conversionGroups;
  };

  // Record the conversions once ready
  async function recordConversions() {
    let conversionGroups: ConversionAttachmentGroup[];
    try {
      conversionGroups = await createConversionGroups();
    } catch (e: any) {
      console.log(e);
      setErrorText(e.message);
      return;
    }

    const result = await conversionService.createBulk(conversionGroups);
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

  const areAttachmentsValid = (): boolean => {
    if (conversionsByNumber == null) return false;

    for (let [convNumber, _] of Object.entries(conversionsByNumber)) {
      const attachmentsForConv = attachments.filter(
        (attachment) => getAttachmentNumber(attachment) === Number(convNumber)
      );

      if (attachmentsForConv.length === 0) return false;
    }

    return true;
  };

  const csvUploaded = csvFile !== null;
  const attachmentsUploaded = attachments.length > 0;

  const conversions =
    conversionsByNumber == null ? null : Object.values(conversionsByNumber);

  const conversionsReadyToRecord =
    !processing &&
    conversions !== null &&
    conversions.length > 0 &&
    attachments &&
    areAttachmentsValid();

  return (
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

      <Box h={4} />
      <Flex justifyContent={"space-evenly"} alignItems={"start"}>
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

        <Box h={2} />
        <Text>
          Enter an assignment code that a user can use to claim these
          conversions:
        </Text>
        <Input
          focusBorderColor="#ED7D31"
          placeholder="Assignment Code..."
          value={assignmentCode}
          onChange={(e) => setAssignmentCode(e.target.value)}
        />
        <Box h={2} />

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
            : areAttachmentsValid()
            ? "Fix Errors"
            : "Missing Attachments"
          : "Upload CSV to Record Conversions"}
      </Button>
      {errorText && <Text color={"red"}>{errorText}</Text>}
    </React.Fragment>
  );
};

export default BulkRecordConversionsWidgetContent;
