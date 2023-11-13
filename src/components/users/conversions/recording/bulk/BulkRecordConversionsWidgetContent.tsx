import React, { useContext, useState } from "react";
import { Button, Heading, Input, InputGroup } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";
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

type Props = {
  compensationGroup: CompensationGroup | null;
};

const BulkRecordConversionsWidgetContent = ({ compensationGroup }: Props) => {
  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const [errorText, setErrorText] = useState(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  const [csvFile, setCsvFile] = useState<File | null>(null);

  const { currentUser } = useContext(UserContext);

  const processCsvFile = async (
    csvFile: File
  ): Promise<Record<number, Conversion>> => {
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

    const rows: string[] = csvContent.split("\n");
    const conversions: Record<number, Conversion> = {};

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const convNumber = Number(row.split(",")[0]);

      const conversion = mapCsvRowToConversion(row);
      if (conversion !== null) {
        conversions[convNumber] = conversion;
      }

      if (convNumber !== i + 1) {
        console.log("Conversion number mismatch");
      }
    }

    return conversions;
  };

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

  const createConversionGroups = async (): Promise<
    ConversionAttachmentGroup[]
  > => {
    if (!csvFile) {
      return [];
    }

    const csvConversions: Record<number, Conversion> = await processCsvFile(
      csvFile
    );

    const conversionGroups: ConversionAttachmentGroup[] = [];
    for (const convNumber of Object.keys(csvConversions)) {
      const conversion = csvConversions[convNumber];
      const attachments = getAttachmentsForConversion(Number(convNumber));
      const conversionGroup: ConversionAttachmentGroup = {
        conversion,
        attachments,
      };
      conversionGroups.push(conversionGroup);
    }

    return conversionGroups;
  };

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

  function resetError() {
    setErrorText(null);
  }

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
      resetError();
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
    } else {
      setAttachments([]);
    }
  };

  const headers = [
    "Conversion number",
    "Conversion date (YYYY-MM-DD)",
    "Sportsbook",
    "Type ('Casino' or 'Sportsbook')",
    "Bet Size ($CAD)",
    "Customer name",
  ];

  const rows = [
    ["1", "2023-10-05", "PointsBet", "sportsbook", "80", "Mitch Marner"],
    ["2", "2023-10-06", "PointsBet", "sportsbook", "100", "Auston Matthews"],
    ["3", "2023-10-06", "UniBet", "casino", "100", "Auston Matthews"],
  ];

  const textSize = "0.8em";

  const csvUploaded = csvFile !== null;
  const attachmentsUploaded = attachments.length > 0;

  return (
    <React.Fragment>
      <Text fontSize={textSize}>
        1. Upload a CSV file with the following format:
      </Text>

      <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th key={index} textAlign="center">
                {header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row: string[], index) => (
            <Tr key={index}>
              {row.map((text, i) => (
                <Td textAlign={"center"} key={i}>
                  {text}{" "}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Box h={2} />
      <Text fontSize={textSize}>
        2. Upload at least one attachment per conversion in the CSV. Use the
        following naming convention:
      </Text>
      <Heading size="xs" alignItems="center">
        {"conv{conversionNumber}_attach{attachmentNumber}.png"}
      </Heading>
      <Text fontSize={textSize}>Examples:</Text>
      <Heading size="xs" alignItems="center">
        conv1_attach1.png, conv1_attach2.png, conv2_attach1.png, ...
      </Heading>

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
      <Box h={2} />

      <Button size="lg" colorScheme="orange" onClick={recordConversions}>
        Record Bulk Conversions
      </Button>
      {errorText && <Text color={"red"}>{errorText}</Text>}
    </React.Fragment>
  );
};

export default BulkRecordConversionsWidgetContent;
