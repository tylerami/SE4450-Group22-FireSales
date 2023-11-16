import React, { useState } from "react";
import {
  Button,
  Flex,
  Heading,
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
import { ChevronDownIcon } from "@chakra-ui/icons";
import { formatDateString } from "utils/Date";
import { Timeframe, getTimeframeLabel } from "models/enums/Timeframe";
import { CompensationGroup } from "@models/CompensationGroup";
import { Client } from "@models/Client";
import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "models/enums/ReferralLinkType";

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
  const tableColumns: {
    label: string;
    getValue: (conv: Conversion) => string | number;
  }[] = [
    {
      label: "Conversion ID",
      getValue: (conv: Conversion) => conv.id,
    },
    {
      label: "Date",
      getValue: (conv: Conversion) => formatDateString(conv.dateOccurred),
    },
    {
      label: "Affilate Link",
      getValue: (conv: Conversion) => conv.affiliateLink.description(),
    },
    {
      label: "Bet size",
      getValue: (conv: Conversion) => conv.amount,
    },
    {
      label: "Customer Name",
      getValue: (conv: Conversion) => conv.customer.fullName,
    },
    {
      label: "Commission",
      getValue: (conv: Conversion) => conv.affiliateLink.commission,
    },
    {
      label: "Status",
      getValue: (conv: Conversion) => conv.status,
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
            {tableColumns.map((property, i) => {
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
              {tableColumns.map((property, i) => {
                return (
                  <Td key={i} textAlign={"center"}>
                    {property.getValue(sale)}
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
