import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Select,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  Conversion,
  setConversionStatus,
  totalCostOfConversions,
} from "models/Conversion";
import { Payout } from "models/Payout";
import { ConversionStatus } from "models/enums/ConversionStatus";
import { User } from "models/User";
import { DependencyInjection } from "models/utils/DependencyInjection";
import React, { useEffect, useState } from "react";
import { ConversionService } from "services/interfaces/ConversionService";
import { PayoutService } from "services/interfaces/PayoutService";
import { UserService } from "services/interfaces/UserService";
import { DayOfTheWeek, getCurrentDayOfWeek } from "models/enums/Timeframe";
import useSuccessNotification from "components/utils/SuccessNotification";
import { PayoutPreferrences } from "models/PayoutPreferrences";
import { formatMoney } from "models/utils/Money";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { formatDateString } from "models/utils/Date";
import { ConversionType } from "models/enums/ConversionType";

type Props = {};

const PayoutsWidget = (props: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);
  const refresh = () => {
    setUpdateTrigger(updateTrigger + 1);
  };

  const userService: UserService = DependencyInjection.userService();

  const payoutService: PayoutService = DependencyInjection.payoutService();

  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const showSuccess = useSuccessNotification();

  const setPayoutDay = async (user: User, day: DayOfTheWeek | undefined) => {
    const updatedUser: User = new User({
      ...user,
      payoutPreferrences: new PayoutPreferrences({
        ...user.payoutPreferrences,
        preferredPayoutDay: day ?? null,
      }),
    });
    await userService.update(updatedUser);
    console.log("asdsd ", updatedUser);
    showSuccess({ message: `Payout day updated to ${day}.` });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const users: User[] = await userService.getAll();
      setUsers(users);
    };

    const fetchPayouts = async () => {
      const payouts: Payout[] = await payoutService.query({});
      setPayouts(payouts);
    };

    const fetchConversions = async () => {
      let conversions: Conversion[] = await conversionService.query({
        includeUnassigned: true,
      });
      conversions = conversions.filter(
        (conv) => conv.type !== ConversionType.retentionIncentive
      );
      setConversions(conversions);
    };

    fetchUsers();
    fetchPayouts();
    fetchConversions();
  }, [conversionService, payoutService, userService, updateTrigger]);

  const userConversionsToBePaid = (uid: string): Conversion[] => {
    return conversions.filter((conversion: Conversion) => {
      return (
        conversion.userId === uid &&
        conversion.status === ConversionStatus.approvedUnpaid
      );
    });
  };

  const markConversionsAsPaid = async (uid: string) => {
    const conversionsToBePaid = userConversionsToBePaid(uid);
    const updates = await conversionService.updateBulk(
      setConversionStatus(conversionsToBePaid, ConversionStatus.approvedPaid)
    );
    if (updates) {
      showSuccess({ message: "Conversions marked as paid!" });
      refresh();
    }
  };

  users.sort(
    (a, b) =>
      totalCostOfConversions(userConversionsToBePaid(b.uid)) -
      totalCostOfConversions(userConversionsToBePaid(a.uid))
  );

  const payoutDayUsers: User[] = users.filter((user: User) => {
    return (
      user.payoutPreferrences?.preferredPayoutDay === getCurrentDayOfWeek() &&
      userConversionsToBePaid(user.uid).length > 0
    );
  });

  const payoutDayNotSetUsers: User[] = users.filter((user: User) => {
    return (
      !user.payoutPreferrences?.preferredPayoutDay &&
      userConversionsToBePaid(user.uid).length > 0
    );
  });

  const amountDueToday: number = payoutDayUsers.reduce(
    (acc: number, user: User) => {
      const unpaidConversions = userConversionsToBePaid(user.uid);
      const unpaidAmount = totalCostOfConversions(unpaidConversions);
      return acc + unpaidAmount;
    },
    0
  );

  const [pageIndex, setPageIndex] = useState(0);

  const pageLength = 10;

  const pageCount = Math.max(1, Math.ceil(payouts.length / pageLength));

  const nextPage = () => {
    if (pageIndex === pageCount - 1) return;
    setPageIndex((prev) => prev + 1);
  };

  const prevPage = () => {
    if (pageIndex === 0) return;
    setPageIndex((prev) => prev - 1);
  };

  const currentPagePayouts: Payout[] = payouts.slice(
    pageIndex * pageLength,
    (pageIndex + 1) * pageLength
  );

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      width={"95%"}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
      gap={2}
    >
      <Flex justifyContent={"start"} gap={4}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          Record Payouts
        </Heading>
      </Flex>
      <Box h={4} />

      {payoutDayUsers.length === 0 && payoutDayNotSetUsers.length === 0 && (
        <Heading>No payouts due today!</Heading>
      )}

      {payoutDayUsers.length > 0 && (
        <React.Fragment>
          <Text fontWeight={600}>
            Payouts for {getCurrentDayOfWeek()} (Due today:{" "}
            {formatMoney(amountDueToday)})
          </Text>
          <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
            <Thead>
              <Tr>
                <Th textAlign={"center"}>User</Th>
                <Th textAlign={"center"}>Unpaid Conversions</Th>
                <Th textAlign={"center"}>Unpaid Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payoutDayUsers.map((user: User) => {
                const unpaidConversions = userConversionsToBePaid(user.uid);
                const unpaidAmount = totalCostOfConversions(unpaidConversions);
                return (
                  <Tr key={user.uid}>
                    <Td textAlign={"center"}>{user.getFullName()}</Td>
                    <Td textAlign={"center"}>{unpaidConversions.length}</Td>
                    <Td textAlign={"center"}>${unpaidAmount}</Td>
                    <Td textAlign={"center"}>
                      <Button
                        colorScheme="green"
                        onClick={() => markConversionsAsPaid(user.uid)}
                      >
                        Mark as Paid
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </React.Fragment>
      )}

      {payoutDayNotSetUsers.length > 0 && (
        <React.Fragment>
          <Box h={4} />
          <Text fontWeight={600}>Users without a payout day</Text>
          <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
            <Thead>
              <Tr>
                <Th textAlign={"center"}>User</Th>
                <Th textAlign={"center"}>Unpaid Conversions</Th>
                <Th textAlign={"center"}>Unpaid Amount</Th>
                <Th textAlign={"center"}>Set Payout Day</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payoutDayNotSetUsers.map((user: User) => {
                const unpaidConversions = userConversionsToBePaid(user.uid);
                const unpaidAmount = totalCostOfConversions(unpaidConversions);
                return (
                  <Tr key={user.uid}>
                    <Td textAlign={"center"}>{user.getFullName()}</Td>
                    <Td textAlign={"center"}>{unpaidConversions.length}</Td>
                    <Td textAlign={"center"}>${unpaidAmount}</Td>
                    <Td>
                      <Select
                        value={undefined}
                        onChange={(e) =>
                          setPayoutDay(
                            user,
                            e.currentTarget.value as DayOfTheWeek | undefined
                          )
                        }
                      >
                        {[undefined, ...Object.values(DayOfTheWeek)].map(
                          (day: DayOfTheWeek | undefined) => {
                            return (
                              <option
                                key={day?.toString() ?? "any"}
                                value={day}
                              >
                                {day ?? "Select day..."}
                              </option>
                            );
                          }
                        )}
                      </Select>
                    </Td>
                    <Td textAlign={"center"}>
                      <Button
                        colorScheme="green"
                        onClick={() => markConversionsAsPaid(user.uid)}
                      >
                        Mark as Paid
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </React.Fragment>
      )}
      <Box h={4} />
      <Flex w="100%" alignItems={"center"}>
        <Text fontWeight={600}>Payout History</Text>
        <Spacer />
        <React.Fragment>
          <IconButton
            isDisabled={pageIndex === 0}
            onClick={prevPage}
            icon={<ChevronLeftIcon />}
            aria-label={""}
          />
          <Text>
            Page {pageIndex + 1} / {pageCount}
          </Text>
          <IconButton
            isDisabled={pageIndex === pageCount - 1}
            onClick={nextPage}
            icon={<ChevronRightIcon />}
            aria-label={""}
          />
        </React.Fragment>
      </Flex>

      <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
        <Thead>
          <Tr>
            <Th textAlign={"center"}>User</Th>
            <Th>Date</Th>
            <Th>Amount</Th>
            <Th>Conversions</Th>
            <Th>Method</Th>
            <Th>Address</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentPagePayouts.map((payout: Payout) => {
            const user: User | undefined = users.find(
              (user: User) => user.uid === payout.userId
            );
            return (
              <Tr key={payout.id}>
                <Td textAlign={"center"}>{user?.getFullName() ?? "Unknown"}</Td>
                <Td>{formatDateString(payout.dateOccurred)}</Td>
                <Td>${formatMoney(payout.amount)}</Td>
                <Td>{payout.conversionIds?.length ?? "Not Specified"}</Td>
                <Td>{payout.paymentMethod}</Td>
                <Td>{payout.paymentAddress}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default PayoutsWidget;
