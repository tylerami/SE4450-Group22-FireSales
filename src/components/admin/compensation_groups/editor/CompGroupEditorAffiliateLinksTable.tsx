import { Switch, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Icon } from "@chakra-ui/react";
import { FaDollarSign } from "react-icons/fa";
import { getReferralLinkTypeLabel } from "models/enums/ReferralLinkType";
import { AffiliateLink } from "models/AffiliateLink";

type Props = {
  affiliateLinks: Partial<AffiliateLink>[];
  setAffiliateLinks: (affiliateLinks: Partial<AffiliateLink>[]) => void;
};

const CompGroupEditorAffiliateLinksTable = ({
  affiliateLinks,
  setAffiliateLinks,
}: Props) => {
  const setAffiliateLink = (
    index: number,
    affiliateLink: Partial<AffiliateLink>
  ) => {
    const newAffiliateLinks = [...affiliateLinks];
    newAffiliateLinks[index] = affiliateLink;
    setAffiliateLinks(newAffiliateLinks);
  };

  const getAffiliateLink = (
    index: number
  ): Partial<AffiliateLink> | undefined => {
    if (index < 0 || index >= affiliateLinks.length) {
      return undefined;
    }
    return affiliateLinks[index];
  };

  const setAffiliateLinkProperties = (
    index: number,
    properties: Partial<AffiliateLink>
  ) => {
    const affiliateLink = getAffiliateLink(index);
    if (!affiliateLink) {
      return;
    }

    setAffiliateLink(index, {
      ...affiliateLink,
      ...properties,
    });
  };

  const columnHeaders: string[] = [
    "Sportsbook / Type",
    "Enabled",
    "Commission",
    "Min. Bet Size",
    "Bet Matches",
  ];

  return (
    <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
      <Thead>
        <Tr>
          {columnHeaders.map((header, index) => (
            <Th key={index} textAlign={"center"}>
              {header}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {Object.values(affiliateLinks).map((link, index) => (
          <Tr key={index}>
            <Td maxW={"5em"} textAlign={"center"}>
              {`${link.clientName} / ${getReferralLinkTypeLabel(link.type!)}`}
            </Td>
            <Td textAlign="center">
              <Switch
                isChecked={link.enabled}
                onChange={(e) =>
                  setAffiliateLinkProperties(index, {
                    enabled: e.target.checked,
                  })
                }
              ></Switch>
            </Td>
            <Td textAlign={"center"}>
              <InputGroup width="8em" margin="auto">
                <InputLeftElement>
                  <Icon as={FaDollarSign} color="gray" />
                </InputLeftElement>
                <Input
                  pl={8}
                  type="number"
                  isDisabled={!link.enabled}
                  placeholder="Commission"
                  value={link.commission ?? ""}
                  onChange={(e) => {
                    const numericValue = Number(e.target.value);
                    setAffiliateLinkProperties(index, {
                      commission: numericValue === 0 ? undefined : numericValue,
                    });
                  }}
                />
              </InputGroup>
            </Td>
            <Td textAlign={"center"}>
              <InputGroup width="8em" margin="auto">
                <InputLeftElement>
                  <Icon as={FaDollarSign} color="gray" />
                </InputLeftElement>
                <Input
                  pl={8}
                  type="number"
                  isDisabled={!link.enabled}
                  placeholder="Min. bet size"
                  value={link.minBetSize ?? ""}
                  onChange={(e) => {
                    const numericValue = Number(e.target.value);
                    setAffiliateLinkProperties(index, {
                      minBetSize: numericValue === 0 ? undefined : numericValue,
                    });
                  }}
                />
              </InputGroup>
            </Td>

            <Td textAlign="center">
              <Switch
                isChecked={link.betMatchEnabled}
                isDisabled={!link.enabled}
                onChange={(e) =>
                  setAffiliateLinkProperties(index, {
                    betMatchEnabled: e.target.checked,
                  })
                }
              ></Switch>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default CompGroupEditorAffiliateLinksTable;
