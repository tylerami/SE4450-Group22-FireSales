import { Table, Thead, Tr, Tbody, Td, Th, Heading } from "@chakra-ui/react";
import React from "react";

import { formatMoney } from "src/models/utils/Money";
import { Client } from "src/models/Client";
import RetentionIncentive from "src/models/RetentionIncentive";
import {
  Conversion,
  conversionsWithType,
  filterConversionsByDateInterval,
} from "src/models/Conversion";
import {
  firstDayOfCurrentMonth,
  getCurrentMonthWithYear as getCurrentMonthWithYearAbbreviation,
} from "src/models/utils/Date";
import { ConversionType } from "src/models/enums/ConversionType";
import { User } from "src/models/User";

const CompGroupRetentionIncentivesTable = ({
  retentionIncentives,
  clients,
  conversions,
  users,
}: {
  retentionIncentives: RetentionIncentive[];
  clients: Client[];
  conversions: Conversion[];
  users: User[];
}) => {
  const currentMonthDistributedIncentives: Conversion[] =
    filterConversionsByDateInterval(
      conversionsWithType(conversions, ConversionType.retentionIncentive),
      {
        fromDate: firstDayOfCurrentMonth(),
      }
    );

  const getClientName = (clientId: string): string => {
    return clients.find((client) => client.id === clientId)?.name || "";
  };

  const tableColumns: {
    label: string;
    getValue: (incentive: RetentionIncentive) => string;
  }[] = [
    {
      label: "Sportsbook",
      getValue: (incentive) => getClientName(incentive.clientId),
    },
    {
      label: "Amount",
      getValue: (incentive) => formatMoney(incentive.amount),
    },
    {
      label: "Monthly Limit / User",
      getValue: (incentive) => incentive.monthlyLimit.toString(),
    },
    {
      label: "Max. Spend / Month",
      getValue: (incentive) =>
        formatMoney(incentive.monthlyLimit * users.length * incentive.amount),
    },
    {
      label: `${getCurrentMonthWithYearAbbreviation()} Spend`,
      getValue: (incentive) =>
        currentMonthDistributedIncentives
          .filter(
            (conversion) =>
              conversion.affiliateLink.clientId === incentive.clientId
          )
          .length.toString(),
    },
  ];

  retentionIncentives.sort((a, b) => a.clientId.localeCompare(b.clientId));

  return (
    <React.Fragment>
      {retentionIncentives.length > 0 && (
        <React.Fragment>
          <Heading size="xs">Retention Incentives</Heading>
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
              {retentionIncentives.map(
                (incentive: RetentionIncentive, i: number) => (
                  <Tr key={i}>
                    {tableColumns.map((column, i) => (
                      <Td key={i} textAlign={"center"}>
                        {column.getValue(incentive)}
                      </Td>
                    ))}
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default CompGroupRetentionIncentivesTable;
