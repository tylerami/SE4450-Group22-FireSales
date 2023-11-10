import React, { useState } from "react";
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

type Props = {};

const BulkRecordConversionsWidgetContent = (props: Props) => {
  const [errorText, setErrorText] = useState(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  const [csvFile, setCsvFile] = useState<File | null>(null);

  function resetError() {
    setErrorText(null);
  }

  function recordConversions() {
    // record bulk conversions
  }

  const handleAttachementsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setAttachments(Array.from(event.target.files));
    } else {
      setAttachments([]);
    }
  };

  const triggerCsvUpload = () => {
    const fileInput = document.getElementById("csv-upload");
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const triggerAttachmentsUpload = () => {
    const fileInput = document.getElementById("attachments-upload");
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const headers = [
    "Conversion number",
    "Conversion date (YYYY-MM-DD)",
    "Sportsbook (write full name)",
    "Conversion amount ($CAD)",
    "Customer name",
  ];

  const rows = [
    ["1", "2023-10-05", "PointsBet", "80", "Mitch Marner"],
    ["2", "2023-10-06", "PointsBet", "100", "Auston Matthews"],
    ["3", "2023-10-06", "UniBet", "100", "Auston Matthews"],
  ];

  const textSize = "0.8em";

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
      <Flex justifyContent={"space-evenly"} alignItems={"center"}>
        <InputGroup width={"full"}>
          <Button size="md" w="100%" onClick={triggerCsvUpload}>
            <Input
              type="file"
              hidden
              onChange={handleAttachementsChange}
              id="csv-upload"
            />
            Upload CSV File
          </Button>
        </InputGroup>
        <Box w={8} />

        <InputGroup width={"full"}>
          <Button size="md" w="100%" onClick={triggerAttachmentsUpload}>
            <Input
              type="file"
              multiple
              hidden
              onChange={handleAttachementsChange}
              id="attachments-upload"
            />
            Upload Attachments
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
