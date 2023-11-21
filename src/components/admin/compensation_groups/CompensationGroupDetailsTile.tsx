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
import { formatMoney } from "models/utils/Money";
import { AffiliateDeal } from "models/AffiliateDeal";
import ImageComponent from "components/utils/ImageComponent";
import { CompensationGroup } from "models/CompensationGroup";
import { AffiliateLink } from "models/AffiliateLink";
import { User } from "models/User";
import { Conversion } from "models/Conversion";
import { Timeframe, getTimeframeLabel } from "models/enums/Timeframe";
import { FilterDefinition } from "@components/utils/Filter";
import CompGroupAffiliateDealsTable from "./CompGroupAffiliateDealsTable";

type Props = {
  compGroup: CompensationGroup;
  selectCompGroup: (compGroup: CompensationGroup) => void;
  users: User[];
  conversions: Conversion[];
};

const CompensationGroupDetailsTile = ({
  compGroup,
  selectCompGroup,
  users,
  conversions,
}: Props) => {
  const timeframes: Timeframe[] = Object.values(Timeframe).filter(
    (value): value is Timeframe => typeof value === "number"
  );

  const [timeframe, setSelectedTimeframe] = useState<Timeframe>(
    Timeframe.lastMonth
  );

  const timeframeFilter: FilterDefinition<Timeframe> = {
    options: timeframes,
    onChange: (value) => setSelectedTimeframe(value as Timeframe),
    value: timeframe,
    label: (value) => getTimeframeLabel(value as Timeframe),
  };

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

      <CompGroupAffiliateDealsTable
        affiliateLinks={Object.values(compGroup.affiliateLinks)}
      />
    </Flex>
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
