import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Conversion } from "models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import ImageComponent from "components/utils/ImageComponent";
import ConversionMessageWidget from "components/common/conversions/ConversionMessagesWidget";
import { formatDateString } from "utils/Date";
import { sampleConversions } from "__mocks__/models/Conversion.mock";
import { Timeframe, getTimeframeLabel } from "models/enums/Timeframe";
import { CompensationGroup } from "@models/CompensationGroup";
import { AffiliateLink } from "@models/AffiliateLink";
import { time } from "console";
import { Client } from "@models/Client";
import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "models/enums/ReferralLinkType";
import { get } from "http";

type Props = {
  conversions: Conversion[];
  clients: Client[];
  compGroup: CompensationGroup | null;
  selectConversion: (conversion: Conversion) => void;
};

const ConversionBrowserContent = ({
  conversions,
  clients,
  selectConversion,
  compGroup,
}: Props) => {
  const properties = [
    {
      label: "Conversion ID",
      function: (conv: Conversion) => conv.id,
    },
    {
      label: "Date",
      function: (conv: Conversion) => formatDateString(conv.dateOccured),
    },
    {
      label: "Affilate Link",
      function: (conv: Conversion) => conv.affiliateLink.description(),
    },
    {
      label: "Bet size",
      function: (conv: Conversion) => conv.amount,
    },
    {
      label: "Customer Name",
      function: (conv: Conversion) => conv.customer.fullName,
    },
    {
      label: "Commission",
      function: (conv: Conversion) => conv.affiliateLink.commission,
    },
    {
      label: "Status",
      function: (conv: Conversion) => conv.status,
    },
  ];

  const [timeframeFilter, setTimeframeFilter] = useState<Timeframe | null>(
    null
  );

  const [clientFilter, setClientFilter] = useState<Client | null>();
  const [referralTypeFilter, setReferralTypeFilter] =
    useState<ReferralLinkType>(ReferralLinkType.casinoAndSports);

  const changeTimeframeFilter = (timeframe: Timeframe | null) => {
    setTimeframeFilter(timeframe);
  };

  const changeClientFilter = (client: Client | null) => {
    setClientFilter(client);
  };

  const changeReferralTypeFilter = (referralType: ReferralLinkType) => {
    setReferralTypeFilter(referralType);
  };

  if (!compGroup) {
    return <Spinner />;
  }

  const timeframes: Timeframe[] = Object.values(Timeframe).filter(
    (t) => typeof t !== "string"
  ) as Timeframe[];

  const referralTypes: ReferralLinkType[] = Object.values(ReferralLinkType);
  referralTypes.sort((a, b) => b.length - a.length);

  return (
    <React.Fragment>
      <Flex alignItems={"center"} gap={4} justifyContent={"start"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          Conversion History
        </Heading>
        <Spacer />

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {clientFilter ? clientFilter.name : "All Sportsbooks"}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => changeClientFilter(null)}>
              All Sportsbooks
            </MenuItem>
            {clients.map((client, i) => (
              <MenuItem onClick={() => changeClientFilter(client)} key={i}>
                {client.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {getReferralLinkTypeLabel(referralTypeFilter)}
          </MenuButton>
          <MenuList>
            {referralTypes.map((type, i) => (
              <MenuItem onClick={() => changeReferralTypeFilter(type)} key={i}>
                {getReferralLinkTypeLabel(type)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {timeframeFilter ? getTimeframeLabel(timeframeFilter) : "All Time"}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => changeTimeframeFilter(null)}>
              All time
            </MenuItem>
            {timeframes.map((timeframe, i) => (
              <MenuItem
                onClick={() => changeTimeframeFilter(timeframe)}
                key={i}
              >
                {getTimeframeLabel(timeframe)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>

      <Table size="sm">
        <Thead>
          <Tr>
            {properties.map((property, i) => {
              return (
                <Th key={i} textAlign={"center"}>
                  {property.label}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {conversions.map((sale, i) => (
            <Tr
              key={i}
              cursor={"pointer"}
              onClick={() => {
                selectConversion(sale);
              }}
              _hover={{ background: "rgba(237, 125, 49, 0.26)" }}
            >
              {properties.map((property, i) => {
                return (
                  <Td key={i} textAlign={"center"}>
                    {property.function(sale)}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </React.Fragment>
  );
};

export default ConversionBrowserContent;
