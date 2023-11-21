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
import React, { useState } from "react";

import { Button } from "@chakra-ui/react";
import { Client } from "models/Client";
import { getReferralLinkTypeLabel } from "models/enums/ReferralLinkType";
import { formatMoney } from "utils/Money";
import { AffiliateDeal } from "@models/AffiliateDeal";
import ImageComponent from "components/utils/ImageComponent";
import { CompensationGroup } from "@models/CompensationGroup";
import { AffiliateLink } from "@models/AffiliateLink";
import { User } from "@models/User";
import { Conversion } from "@models/Conversion";
import { Timeframe, getTimeframeLabel } from "models/enums/Timeframe";
import { FilterDefinition } from "@components/utils/Filter";

type Props = {};

const CompGroupAffiliateDealsTable = ({
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

export default CompGroupAffiliateDealsTable;
