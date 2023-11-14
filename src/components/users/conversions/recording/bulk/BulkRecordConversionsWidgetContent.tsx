import React, { useContext, useState } from "react";
import {
  Button,
  Heading,
  Icon,
  Input,
  InputGroup,
  Spinner,
} from "@chakra-ui/react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { Conversion, ConversionAttachmentGroup } from "models/Conversion";
import { filterCsvHeaders, getCsvFileContent } from "utils/File";
import { sampleClients } from "__mocks__/models/Client.mock";
import { findClosestMatch } from "utils/String";
import { Client } from "models/Client";
import { UserContext } from "components/auth/UserProvider";
import { CompensationGroup } from "models/CompensationGroup";
import { ReferralLinkType } from "models/enums/ReferralLinkType";
import { AffiliateLink } from "models/AffiliateLink";
import { Customer } from "models/Customer";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "utils/DependencyInjection";
import BulkRecordConversionsInstructions from "./BulkRecordConversionsInstructions";
import { CheckCircleIcon } from "@chakra-ui/icons";
import BulkRecordConversionsProcessedTable from "./BulkRecordConversionsProcessedTable";
import { FiXCircle } from "react-icons/fi";

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
  const [attachmentsAreValid, setAttachmentsAreValid] =
    useState<boolean>(false);

  const { currentUser } = useContext(UserContext);

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

    const mapCsvRowToConversion = (csvRow: string): Conversion | null => {
      const userId = currentUser?.uid;
      if (!userId || compensationGroup === null) {
        return null;
      }

      const values: string[] = csvRow.split(",");
      const clients: Client[] = sampleClients;

      const dateString: string = values[1];
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
        return null;
      }

      const conversion: Conversion = Conversion.fromManualInput({
        dateString,
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

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const convNumber = Number(row.split(",")[0]);

      const conversion = mapCsvRowToConversion(row);
      if (conversion !== null) {
        conversionsByNumber[convNumber] = conversion;
      }

      if (convNumber !== i + 1) {
        console.log("Conversion number mismatch");
      }
    }

    setConversionsByNumber(conversionsByNumber);
    setProcessing(false);
    return conversionsByNumber;
  };

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

  const triggerCsvUpload = () => {
    if (csvFile !== null) {
      setCsvFile(null);
      return;
    }
    const fileInput = document.getElementById("csv-upload");
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const handleCsvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCsvFile(event.target.files[0]);
      processCsvFile(event.target.files[0]);
    } else {
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
      validateAttachments();
    } else {
      setAttachments([]);
    }
  };

  const validateAttachments = () => {
    if (conversionsByNumber == null) {
      setAttachmentsAreValid(false);
      return;
    }

    setProcessing(true);
    let convNumsWithoutAttachments: number[] =
      Object.keys(conversionsByNumber).map(Number);

    for (let attachment of attachments) {
      const attachmentName = attachment.name;
      const attachmentNumber = Number(
        attachmentName.split("_")[0].replace("conv", "")
      );
      if (attachmentNumber in convNumsWithoutAttachments) {
        convNumsWithoutAttachments = convNumsWithoutAttachments.filter(
          (n) => n !== attachmentNumber
        );
      }
    }
    if (convNumsWithoutAttachments.length > 0) {
      setAttachmentsAreValid(false);
    } else {
      setAttachmentsAreValid(true);
    }
    setProcessing(false);
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
    attachmentsAreValid;

  return (
    <React.Fragment>
      {processing ? (
        <Spinner size="xl" />
      ) : conversions != null ? (
        <BulkRecordConversionsProcessedTable conversions={conversions} />
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
        isDisabled={!csvFile}
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
  );
};

export default BulkRecordConversionsWidgetContent;
