import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Conversion } from "src/models/Conversion";
import { formatDateString } from "src/models/utils/Date";
import { Payout } from "src/models/Payout";
import { formatMoney } from "src/models/utils/Money";
import { UserContext } from "components/auth/UserProvider";
import { PayoutService } from "services/interfaces/PayoutService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import { getPaymentMethodLabel } from "src/models/enums/PaymentMethod";
import { ConversionService } from "services/interfaces/ConversionService";
import { ConversionStatus } from "src/models/enums/ConversionStatus";

type Props = {};

const tableColumns: {
  label: string;
  getValue: (payout: Payout) => string;
}[] = [
  {
    label: "Date",
    getValue: (payout: Payout) => formatDateString(payout.dateOccurred),
  },
  {
    label: "Amount",
    getValue: (payout: Payout) => formatMoney(payout.amount),
  },
  {
    label: "Status",
    getValue: (payout: Payout) => "Delivered",
  },
  {
    label: "Payment Method",
    getValue: (payout: Payout) => getPaymentMethodLabel(payout.paymentMethod),
  },
  {
    label: "Payment Address",
    getValue: (payout: Payout) => payout.paymentAddress,
  },
];

const UserPaymentHistory = (props: Props) => {
  const { currentUser } = useContext(UserContext);

  const payoutService: PayoutService = DependencyInjection.payoutService();

  const conversionsService: ConversionService =
    DependencyInjection.conversionService();

  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);

  useEffect(() => {
    const fetchPayouts = async () => {
      if (!currentUser?.uid) return;

      const payouts = await payoutService.query({ userId: currentUser.uid });
      setPayouts(payouts);
    };

    const fetchConversions = async () => {
      if (!currentUser?.uid) return;

      const conversions = await conversionsService.query({
        userId: currentUser.uid,
      });
      setConversions(conversions);
      console.log(conversions);
    };

    fetchPayouts();
    fetchConversions();
  }, [conversionsService, currentUser, payoutService]);

  // sort payouts reverse chronologically
  payouts.sort((a, b) => b.dateOccurred.getTime() - a.dateOccurred.getTime());

  const cumulativeEarnings = payouts.reduce((acc, payout) => {
    return acc + payout.amount;
  }, 0);

  const outstandingBalance =
    conversions
      .filter((conv) => conv.status !== ConversionStatus.rejected)
      .reduce((acc, conv) => acc + conv.affiliateLink.commission, 0) -
    cumulativeEarnings;

  return (
    <Flex direction={"column"} w="100%">
      {payouts && (
        <React.Fragment>
          <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
            Payout History
          </Heading>
          <Box h={2} />

          <Text>Cumulative Earnings: {formatMoney(cumulativeEarnings)}</Text>
          <Text>Outstanding Balance: {formatMoney(outstandingBalance)}</Text>
          <Box h={6} />

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
              {payouts.map((payouts, i) => (
                <Tr key={i} _hover={{ background: "rgba(237, 125, 49, 0.26)" }}>
                  {tableColumns.map((property, i) => {
                    return (
                      <Td key={i} textAlign={"center"}>
                        {property.getValue(payouts)}
                      </Td>
                    );
                  })}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </React.Fragment>
      )}
    </Flex>
  );
};

export default UserPaymentHistory;
