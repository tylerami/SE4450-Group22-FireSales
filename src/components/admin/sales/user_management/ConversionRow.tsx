import { Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { Sale } from "../../../../models/sale";
import { format } from "util";

type Props = {
  sale: Sale;
};

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

const ConversionRow = (props: Props) => {
  return (
    <Flex width={"100%"} justifyContent={"space-evenly"}>
      {properties.map((property) => {
        return (
          <ConversionRowBox
            title={property.label}
            text={property.function(props.sale)}
          ></ConversionRowBox>
        );
      })}
    </Flex>
  );
};

const ConversionRowBox = ({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
}) => {
  return (
    <Flex direction={"column"} alignItems="start" gap={2}>
      <Heading size="sm">{title}</Heading>
      {text && <Text>{text}</Text>}
      {children}
    </Flex>
  );
};

export default ConversionRow;

function formatDateString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
}
