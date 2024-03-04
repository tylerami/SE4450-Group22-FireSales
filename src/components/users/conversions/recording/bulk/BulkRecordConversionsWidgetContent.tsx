import React, { useContext, useState } from "react";
import { Button, Input, InputGroup, Spinner } from "@chakra-ui/react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { Conversion, ConversionAttachmentGroup } from "src/models/Conversion";
import { generateSampleClients } from "__mocks__/models/Client.mock";
import { findClosestMatch } from "src/models/utils/String";
import { Client } from "src/models/Client";
import { UserContext } from "components/auth/UserProvider";
import { CompensationGroup } from "src/models/CompensationGroup";
import { ReferralLinkType } from "src/models/enums/ReferralLinkType";
import { AffiliateLink } from "src/models/AffiliateLink";
import { Customer } from "src/models/Customer";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import BulkRecordConversionsInstructions from "./BulkRecordConversionsInstructions";
import BulkRecordConversionsProcessedTable from "./BulkRecordConversionsProcessedTable";
import { parseDateString } from "src/models/utils/Date";
import {
  filterCsvHeaders,
  getCsvFileContent,
} from "src/models/utils/CsvParser";

// ----------------------------------------------------------------------------
// NOT IN USE
// ----------------------------------------------------------------------------

type Props = {
  compensationGroup: CompensationGroup | null;
  refresh: () => void;
};

const BulkRecordConversionsWidgetContent = ({
  compensationGroup,
  refresh,
}: Props) => {
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

  const { currentUser } = useContext(UserContext);

  // Process the CSV file into conversions
  const processCsvFile = async (
    csvFile: File
  ): Promise<Record<number, Conversion>> => {
    setProcessing(true);
    let csvContentRows: string[][] = await getCsvFileContent(csvFile);

    const expectedHeaders = [
      "number",
      "date",
      "sportsbook",
      "type",
      "size",
      "name",
    ];
    csvContentRows = filterCsvHeaders({
      csvContentRows,
      expectedHeaders,
      keywordMatchThreshold: 3,
    });
    console.log(csvContentRows);

    const mapCsvRowToConversion = (csvRow: string): Conversion | null => {
      const userId = currentUser?.uid;
      if (!userId || compensationGroup === null) {
        console.log("No user or compensation group");
        return null;
      }

      const values: string[] = csvRow.split(",");
      const clients: Client[] = generateSampleClients(5);

      const dateString: string = values[1];
      const dateOccurred: Date | null = parseDateString(
        dateString,
        "yyyy-mm-dd"
      );
      if (dateOccurred === null) {
        console.log("Invalid date");
        return null;
      }

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

      const conversion: Conversion = new Conversion({
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

    const conversionsByNumber: Record<number, Conversion> = {};

    for (let i = 0; i < csvContentRows.length; i++) {
      const row = csvContentRows[i];
      const convNumber = Number(row[0]);

      const conversion = mapCsvRowToConversion(row.join(","));
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

    for (let [convNumber] of Object.keys(conversionsByNumber)) {
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
        <BulkRecordConversionsProcessedTable
          attachments={attachments}
          conversionsByNumber={conversionsByNumber}
        />
      ) : (
        <BulkRecordConversionsInstructions />
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

        <Box w={8} />

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
