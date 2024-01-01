import { Table, Thead, Tr, Tbody, Td, Th, Heading } from "@chakra-ui/react";
import React from "react";

import { getReferralLinkTypeLabel } from "models/enums/ReferralLinkType";
import { formatMoney } from "models/utils/Money";
import { AffiliateLink } from "models/AffiliateLink";
import { Conversion } from "models/Conversion";

const CompGroupAffiliateDealsTable = ({
  conversions,
  affiliateLinks,
}: {
  conversions: Conversion[];
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
      label: "Bet Matches",
      getValue: (link) => (link.betMatchEnabled ? "Yes" : "No"),
    },
    {
      label: "Monthly Limit",
      getValue: (link) => link.monthlyLimit?.toString() ?? "None",
    },
  ];

  affiliateLinks.sort((a, b) => a.clientName.localeCompare(b.clientName));
  affiliateLinks = affiliateLinks.filter((link) => link.enabled);

  return (
    <React.Fragment>
      <Heading size="xs">Affiliate Links</Heading>
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
    </React.Fragment>
  );
};

export default CompGroupAffiliateDealsTable;
