import React from "react";

import {
  IconButton,
  Switch,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td, Icon } from "@chakra-ui/react";
import { FaDollarSign, FaTrash } from "react-icons/fa";
import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "src/models/enums/ReferralLinkType";
import { AffiliateDeal } from "src/models/AffiliateDeal";

type Props = {
  affiliateDeals: Partial<AffiliateDeal>[];
  setDeal: (index: number, deal: Partial<AffiliateDeal>) => void;
  removeDeal: (index: number) => void;
};

const ClientAffiliateDealsTable = ({
  affiliateDeals,
  setDeal,
  removeDeal,
}: Props) => {
  const getDeal = (index: number): Partial<AffiliateDeal> | undefined => {
    return affiliateDeals[index];
  };

  const setDealProperty = (
    index: number,
    dealUpdate: Partial<AffiliateDeal>
  ) => {
    setDeal(index, {
      ...getDeal(index)!,
      ...dealUpdate,
    });
  };

  const referralLinkTypes: (ReferralLinkType | null)[] = [
    null,
    ReferralLinkType.sports,
    ReferralLinkType.casino,
  ];

  return (
    <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
      <Thead>
        <Tr>
          <Th textAlign="center">Enabled</Th>
          <Th textAlign="center">Link Type</Th>
          <Th textAlign="center">Link</Th>
          <Th textAlign="center">CPA</Th>
          <Th textAlign="center">Target Avg. Bet</Th>
          <Th textAlign="center">Target Monthly Conv.</Th>
        </Tr>
      </Thead>
      <Tbody>
        {affiliateDeals.map((deal, index) => (
          <Tr key={index}>
            <Td textAlign="center">
              <Switch
                isChecked={getDeal(index)!.enabled}
                onChange={(e) => {
                  setDealProperty(index, {
                    enabled: e.target.checked,
                  });
                }}
              ></Switch>
            </Td>
            <Td textAlign={"center"}>
              <Select
                size="sm"
                value={deal.type ?? undefined}
                onChange={(e) => {
                  const newLinkType: ReferralLinkType | undefined =
                    ReferralLinkType[
                      e.target.value as keyof typeof ReferralLinkType
                    ];
                  console.log("New link type", newLinkType);
                  setDealProperty(index, {
                    type: newLinkType ?? null,
                  });
                }}
              >
                {referralLinkTypes.map((linkType) => (
                  <option key={linkType} value={linkType ?? undefined}>
                    {getReferralLinkTypeLabel(linkType)}
                  </option>
                ))}
              </Select>
            </Td>

            <Td textAlign={"center"}>
              <Input
                size={"sm"}
                isDisabled={!affiliateDeals[index].enabled ?? true}
                placeholder="Link"
                value={affiliateDeals[index].link ?? ""}
                onChange={(e) => {
                  setDealProperty(index, {
                    link: e.target.value,
                  });
                }}
              />
            </Td>
            <Td textAlign={"center"}>
              <InputGroup width="8em" margin="auto">
                <InputLeftElement>
                  <Icon as={FaDollarSign} color="gray" />
                </InputLeftElement>
                <Input
                  pl={8}
                  size={"sm"}
                  type="number"
                  isDisabled={!affiliateDeals[index].enabled ?? true}
                  placeholder="CPA"
                  value={affiliateDeals[index].cpa ?? ""}
                  onChange={(e) => {
                    const numericValue = Number(e.target.value);
                    setDealProperty(index, {
                      cpa: numericValue === 0 ? undefined : numericValue,
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
                  size={"sm"}
                  type="number"
                  isDisabled={!affiliateDeals[index].enabled ?? true}
                  placeholder="Avg. Bet Size"
                  value={affiliateDeals[index].targetBetSize ?? ""}
                  onChange={(e) => {
                    const numericValue = Number(e.target.value);
                    setDealProperty(index, {
                      targetBetSize:
                        numericValue === 0 ? undefined : numericValue,
                    });
                  }}
                />
              </InputGroup>
            </Td>
            <Td textAlign={"center"}>
              <Input
                width="6em"
                type="number"
                size={"sm"}
                isDisabled={!affiliateDeals[index].enabled ?? true}
                placeholder="# Conv."
                value={affiliateDeals[index].targetMonthlyConversions ?? ""}
                onChange={(e) => {
                  const numericValue = Number(e.target.value);
                  setDealProperty(index, {
                    targetMonthlyConversions:
                      numericValue === 0 ? undefined : numericValue,
                  });
                }}
              />
            </Td>
            <Td textAlign={"center"}>
              <IconButton
                aria-label="Close"
                icon={<FaTrash />}
                onClick={() => removeDeal(index)}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default ClientAffiliateDealsTable;
