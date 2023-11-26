import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  Conversion,
  averageBetSize,
  averageCommission,
  totalCommission,
  totalGrossProfit,
} from "models/Conversion";
import { Payout } from "models/Payout";
import { formatMoney } from "models/utils/Money";
import { ConversionStatus } from "models/enums/ConversionStatus";

type Props = {
  filteredConversions: Conversion[];
  filteredPayouts: Payout[];
};

const SalesTeamTotalsTable = ({
  filteredConversions,
  filteredPayouts,
}: Props) => {
  const getOutstandingAccountsTotal = (): number => {
    const totalPayout = filteredPayouts.reduce(
      (total, payout) => total + payout.amount,
      0
    );

    const totalEarnings = totalCommission(filteredConversions);
    return totalEarnings - totalPayout;
  };

  const tableColumns: {
    header: string;
    value?: string;
  }[] = [
    {
      header: "Conversions",
      value: filteredConversions.length.toString(),
    },
    ...(useBreakpointValue({ base: false, lg: true })
      ? [
          {
            header: "Earnings",
            value: formatMoney(totalCommission(filteredConversions)),
          },
        ]
      : []),
    {
      header: "Profit",
      value: formatMoney(totalGrossProfit(filteredConversions)),
    },
    {
      header: "Amount Due",
      value: formatMoney(getOutstandingAccountsTotal()),
    },

    ...(useBreakpointValue({ base: false, "2xl": true })
      ? [
          {
            header: "Avg. Commission",
            value: formatMoney(averageCommission(filteredConversions)),
          },
        ]
      : []),
    ...(useBreakpointValue({ base: false, "2xl": true })
      ? [
          {
            header: "Avg. Bet Size",
            value: formatMoney(averageBetSize(filteredConversions)),
          },
        ]
      : []),
    {
      header: "Unverified conv.",
      value: filteredConversions
        .filter((conv) => conv.status === ConversionStatus.pending)
        .length.toString(),
    },
  ];

  return (
    <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
      <Thead>
        <Tr>
          {tableColumns.map((column, index) => (
            <Th textAlign={"center"} key={index}>
              {column.header}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        <Tr
          _hover={{ background: "rgba(237, 125, 49, 0.26)" }}
          textAlign={"center"}
          transition={"all 0.2s ease-in-out"}
          height={"3em"}
        >
          {tableColumns.map(
            (column, index) =>
              column.value && (
                <Td textAlign={"center"} key={index}>
                  {column.value}
                </Td>
              )
          )}
        </Tr>
      </Tbody>
    </Table>
  );
};

export default SalesTeamTotalsTable;
