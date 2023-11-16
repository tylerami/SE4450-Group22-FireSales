import React from "react";
import { Heading } from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from "@chakra-ui/react";

type Props = {};

const AdminRecordConversionsInstructions = (props: Props) => {
  const headers = [
    "Conversion number",
    "Date (YYYY-MM-DD)",
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
    </React.Fragment>
  );
};

export default AdminRecordConversionsInstructions;
