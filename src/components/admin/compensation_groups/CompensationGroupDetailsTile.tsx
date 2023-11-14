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
import { CompensationGroup } from "@models/CompensationGroup";
import { AffiliateLink } from "@models/AffiliateLink";

type Props = {
  compGroup: CompensationGroup;
  selectCompGroup: (compGroup: CompensationGroup) => void;
};

const CompensationGroupDetailsTile = ({
  compGroup,
  selectCompGroup,
}: Props) => {
  return (
    <Flex
      borderRadius={"12px"}
      p={6}
      pt={2}
      gap={2}
      border="1px solid #E2E8F0"
      opacity={compGroup.enabled ? 1 : 0.7}
      w="100%"
      direction={"column"}
    >
      <Flex w="100%" gap={10} alignItems={"center"}>
        <GroupProperty label={"Group ID"} value={compGroup.id} />
        <Spacer />
        {!compGroup.enabled && (
          <Text fontStyle={"italic"} fontWeight={600}>
            Disabled
          </Text>
        )}

        <Button onClick={(_) => selectCompGroup(compGroup)}>Edit</Button>
      </Flex>
      <Heading size="xs">Affiliate Links</Heading>

      <AffiliateDealTable
        affiliateLinks={Object.values(compGroup.affiliateLinks)}
      />
    </Flex>
  );
};

const AffiliateDealTable = ({
  affiliateLinks,
}: {
  affiliateLinks: AffiliateLink[];
}) => {
  const tableColumns: {
    label: string;
    getValue: (link: AffiliateLink) => string;
  }[] = [
    {
      label: "Sportsbook / Type",
      getValue: (link) =>
        `${link.clientName} - ${getReferralLinkTypeLabel(link.type)}`,
    },
    {
      label: "Commission",
      getValue: (link) => formatMoney(link.commission),
    },
    {
      label: "Min Bet Size",
      getValue: (link) => formatMoney(link.minBetSize),
    },
    {
      label: "CPA",
      getValue: (link) => formatMoney(link.cpa),
    },
    {
      label: "Enabled",
      getValue: (link) => (link.enabled ? "Yes" : "No"),
    },
  ];

  affiliateLinks.sort((a, b) => a.clientName.localeCompare(b.clientName));

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
        {affiliateLinks.map((link: AffiliateLink, i: number) => (
          <Tr key={i}>
            {tableColumns.map((column, i) => (
              <Td key={i} textAlign={"center"}>
                {column.getValue(link)}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const GroupProperty = ({
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

export default CompensationGroupDetailsTile;
