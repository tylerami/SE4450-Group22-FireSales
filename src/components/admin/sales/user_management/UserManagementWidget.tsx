import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Sale, createSaleId } from "../../../../models/sale";
import { customerIdFromName } from "../../../../models/customer";
import ConversionRow from "./ConversionRow";
import ImageComponent from "../../../utils/ImageComponent";
import { CloseIcon } from "@chakra-ui/icons";

type Props = {};

const sportsbooks = [
  {
    clientId: "pointsbet",
    commission: 500,
    minBet: 100,
  },
  {
    clientId: "betano",
    commission: 500,
    minBet: 100,
  },
  {
    clientId: "proline",
    commission: 500,
    minBet: 100,
  },
  {
    clientId: "bet99",
    commission: 500,
    minBet: 100,
  },
];

const conversions: Sale[] = [
  {
    id: "2023-11-07_user1_pointsbet_tyler_amirault",
    userId: "user1",
    clientId: "pointsbet",
    amount: 100,
    date: new Date(),
    currencyIso: "USD",
    customerId: customerIdFromName("Tyler Amirault"),
    commission: 50,
  },
  {
    id: "2",
    userId: "1",
    clientId: "pointsbet",
    amount: 100,
    date: new Date(),
    currencyIso: "USD",
    customerId: customerIdFromName("Tyler Amirault"),
    commission: 50,
  },
  {
    id: "3s",
    userId: "1",
    clientId: "pointsbet",
    amount: 100,
    date: new Date(),
    currencyIso: "USD",
    customerId: customerIdFromName("Tyler Amirault"),
    commission: 50,
  },
];

const properties = [
  {
    label: "Conversion ID",
    function: (Sale) => Sale.id,
  },
  {
    label: "Date",
    function: (Sale) => formatDateString(Sale.date),
  },
  {
    label: "Sportsbook",
    function: (Sale) => Sale.clientId,
  },
  {
    label: "Bet size",
    function: (Sale) => Sale.amount,
  },
  {
    label: "Customer Name",
    function: (Sale) => Sale.customerId,
  },
  {
    label: "Commission",
    function: (Sale) => Sale.commission,
  },
];
const UserManagementWidget = (props: Props) => {
  const [selectedConversion, setSelectedConversion] = useState<Sale | null>(
    null
  );

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      minWidth={"35em"}
      width={"100%"}
      gap={6}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Flex justifyContent={"space-between"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          {selectedConversion
            ? `${formatDateString(selectedConversion.date)} / ${
                selectedConversion.clientId
              } / ${selectedConversion.customerId} / $${
                selectedConversion.amount
              } bet / $${selectedConversion.commission} commission `
            : "User Management"}
        </Heading>

        {selectedConversion && (
          <IconButton
            onClick={() => {
              setSelectedConversion(null);
            }}
            icon={<CloseIcon />}
            aria-label={""}
          />
        )}
      </Flex>

      {selectedConversion && (
        <Flex
          maxH={"40em"}
          gap={10}
          justifyContent={"space-evenly"}
          alignItems={"center"}
          w="100%"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <ImageComponent
              imagePath={`/conversions/1/${selectedConversion.id}_${
                index + 1
              }.png`}
            />
          ))}
        </Flex>
      )}

      {!selectedConversion && (
        <Table size="sm">
          <Thead>
            <Tr>
              {properties.map((property, i) => {
                return <Th textAlign={"center"}>{property.label}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {conversions.map((sale, i) => {
              return (
                <React.Fragment>
                  <Tr>
                    {properties.map((property, i) => {
                      return (
                        <Td textAlign={"center"}>{property.function(sale)}</Td>
                      );
                    })}
                  </Tr>
                  <Tr width={"100%"}>
                    {" "}
                    <Td colSpan={properties.length / 2}>
                      <Button
                        width={"full"}
                        onClick={() => setSelectedConversion(sale)}
                      >
                        View Attachments
                      </Button>
                    </Td>
                    <Td colSpan={properties.length / 2}>
                      <Button width={"full"}>Expand Conversation</Button>
                    </Td>
                  </Tr>
                  <Box h={4}></Box>
                </React.Fragment>
              );
            })}
          </Tbody>
        </Table>
      )}
    </Flex>
  );
};

export default UserManagementWidget;

function formatDateString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
}
