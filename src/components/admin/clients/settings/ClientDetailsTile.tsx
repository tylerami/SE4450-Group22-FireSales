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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { Button } from "@chakra-ui/react";
import { Client } from "src/models/Client";
import { getReferralLinkTypeLabel } from "src/models/enums/ReferralLinkType";
import { formatMoney } from "src/models/utils/Money";
import { AffiliateDeal } from "src/models/AffiliateDeal";
import ImageComponent from "components/utils/ImageComponent";
import { ClientService } from "services/interfaces/ClientService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";

type Props = {
  client: Client;
  selectClient: (client: Client) => void;
};

const ClientDetailsTile = ({ client, selectClient }: Props) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const clientService: ClientService = DependencyInjection.clientService();

  useEffect(() => {
    const fetchLogo = async () => {
      const logoUrl = await clientService.getLogoUrl(client.id);
      setLogoUrl(logoUrl);
    };

    fetchLogo();
  });

  return (
    <Flex
      borderRadius={"12px"}
      p={6}
      pt={2}
      gap={2}
      border="1px solid #E2E8F0"
      opacity={client.enabled ? 1 : 0.6}
      w="100%"
      direction={"column"}
    >
      <Flex w="100%" gap={10} alignItems={"center"}>
        <ImageComponent
          height="3em"
          width="10em"
          margin={"2"}
          imageUrl={logoUrl}
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
              <Td maxW="40vw" key={i} textAlign={"center"}>
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
