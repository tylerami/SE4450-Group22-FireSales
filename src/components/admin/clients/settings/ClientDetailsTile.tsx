import {
  Flex,
  Heading,
  Table,
  Thead,
  Tr,
  Tbody,
  Text,
  Td,
  Th,
  Spacer,
  Box,
} from "@chakra-ui/react";
import React from "react";

import { Button } from "@chakra-ui/react";
import { Client } from "models/Client";
import { getReferralLinkTypeLabel } from "models/enums/ReferralLinkType";
import { formatMoney } from "utils/Money";
import { AffiliateDeal } from "@models/AffiliateDeal";
import ImageComponent from "components/utils/ImageComponent";

type Props = {
  client: Client;
  selectClient: (client: Client) => void;
};

const ClientDetailsTile = ({ client, selectClient }: Props) => {
  return (
    <Flex
      borderRadius={"12px"}
      p={6}
      pt={2}
      gap={2}
      border="1px solid #E2E8F0"
      opacity={client.enabled ? 1 : 0.7}
      w="100%"
      direction={"column"}
    >
      <Flex w="100%" gap={10} alignItems={"center"}>
        <ImageComponent
          height="3em"
          width="10em"
          margin={"2"}
          imagePath={`/sportsbooks/logos/${client.id}-logo-dark.png`}
        />
        <ClientProperty label={"Display Name"} value={client.name} />
        <ClientProperty label={"ID"} value={client.id} />
        <Spacer />
        {!client.enabled && (
          <Text fontStyle={"italic"} fontWeight={600}>
            Disabled
          </Text>
        )}

        <Button onClick={(_) => selectClient(client)}>Edit</Button>
      </Flex>
      <Heading size="xs">Affiliate Deals</Heading>

      <AffiliateDealTable
        affiliateDeals={Object.values(client.affiliateDeals)}
      />
    </Flex>
  );
};

const AffiliateDealTable = ({
  affiliateDeals,
}: {
  affiliateDeals: AffiliateDeal[];
}) => {
  const tableColumns: {
    label: string;
    getValue: (deal: AffiliateDeal) => string;
  }[] = [
    {
      label: "Type",
      getValue: (deal) => getReferralLinkTypeLabel(deal.type),
    },
    {
      label: "Link",
      getValue: (deal) => deal.link,
    },
    {
      label: "CPA",
      getValue: (deal) => formatMoney(deal.cpa),
    },
    {
      label: "Target Bet Size",
      getValue: (deal) =>
        deal.targetBetSize ? formatMoney(deal.targetBetSize) : "N/A",
    },
    {
      label: "Target Conv. / Month",
      getValue: (deal) =>
        deal.targetMonthlyConversions
          ? deal.targetMonthlyConversions.toString()
          : "N/A",
    },
  ];

  return (
    <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
      <Thead>
        <Tr>
          {tableColumns.map((column, index) => (
            <Th key={index} textAlign="center">
              {column.label}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {affiliateDeals.map((deal: AffiliateDeal, i: number) => (
          <Tr key={i}>
            {tableColumns.map((column, i) => (
              <Td key={i} textAlign={"center"}>
                {column.getValue(deal)}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const ClientProperty = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <Flex direction={"row"} gap={2} alignItems={"center"}>
      <Text fontSize={"md"}>{label}:</Text>
      <Heading color="#ED7D31" size="md">
        {value}
      </Heading>
    </Flex>
  );
};

export default ClientDetailsTile;
