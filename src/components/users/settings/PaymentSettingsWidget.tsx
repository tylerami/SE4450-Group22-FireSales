import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  Select,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useState } from "react";
import {
  PaymentMethod,
  getPaymentMethodLabel,
} from "models//enums/PaymentMethod";
import UserPaymentHistory from "./UserPaymentHistory";
import { UserContext } from "components/auth/UserProvider";
import { UserService } from "services/interfaces/UserService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import useSuccessNotification from "components/utils/SuccessNotification";
import { User } from "models/User";
import { DayOfTheWeek } from "models/enums/Timeframe";
import { PayoutPreferrences } from "models/PayoutPreferrences";

type Props = {};

const PaymentSettingsWidget = (props: Props) => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [payoutDay, setPayoutDay] = useState<DayOfTheWeek | null>(
    currentUser?.payoutPreferrences?.preferredPayoutDay || null
  );
  const [paymentType, setPaymentType] = useState<PaymentMethod>(
    currentUser?.payoutPreferrences?.preferredMethod || PaymentMethod.etransfer
  );
  const [payoutAddress, setPayoutAddress] = useState<string>(
    currentUser?.payoutPreferrences?.getPreferredAddress() || ""
  );

  const userService: UserService = DependencyInjection.userService();

  const showSuccess = useSuccessNotification();

  const generatePayoutPreferences = useCallback(() => {
    if (!currentUser) return;
    console.log("generating payment preferrences");
    return new PayoutPreferrences({
      preferredMethod: paymentType,
      preferredPayoutDay: payoutDay ?? undefined,
      addressByMethod: {
        [paymentType]: payoutAddress,
      },
    });
  }, [currentUser, paymentType, payoutDay, payoutAddress]);

  const saveChanges = async () => {
    if (!currentUser) return;

    const updatedUser: User = new User({
      ...currentUser,
      payoutPreferrences: generatePayoutPreferences(),
    });

    const result = await userService.update(updatedUser);
    if (result) {
      showSuccess({ message: "Changes saved successfully!" });
      setCurrentUser(updatedUser);
    }
  };

  const changesMade = () => {
    if (!currentUser) return false;

    console.log(
      "changes made",
      currentUser.payoutPreferrences,
      generatePayoutPreferences(),
      currentUser.payoutPreferrences !== generatePayoutPreferences()
    );

    return currentUser.payoutPreferrences !== generatePayoutPreferences();
  };

  // paypal is username, email, mobile

  const paymentTypeFieldName: Record<PaymentMethod, string> = {
    [PaymentMethod.paypal]: "Paypal username, email, or mobile",
    [PaymentMethod.etransfer]: "E-transfer email or mobile",
  };

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      width={"95%"}
      gap={6}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Flex justifyContent={"space-between"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          Payment Settings
        </Heading>

        <Button isDisabled={!changesMade()} onClick={saveChanges}>
          Save Changes
        </Button>
      </Flex>

      <Flex width={"48%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Payment type*
        </Text>
        <Box h={1}></Box>

        <Select
          color={!paymentType ? "gray" : "black"}
          placeholder="Choose an option..."
          onChange={(e) => setPaymentType(e.target.value as PaymentMethod)}
          value={paymentType}
        >
          {Object.values(PaymentMethod).map((option, i) => (
            <option key={i} value={option}>
              {getPaymentMethodLabel(option)}
            </option>
          ))}
        </Select>
      </Flex>

      {paymentType && (
        <Flex width={"48%"} flexDirection={"column"}>
          <Text color="gray" fontSize="0.8em">
            {paymentTypeFieldName[paymentType]}
          </Text>
          <Box h={1}></Box>

          <InputGroup>
            <Input
              focusBorderColor="#ED7D31"
              variant={"outline"}
              placeholder={paymentTypeFieldName[paymentType]}
              value={payoutAddress}
              onChange={(e) => setPayoutAddress(e.target.value)}
            ></Input>
          </InputGroup>
        </Flex>
      )}
      <Flex width={"48%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Preferred payout day
        </Text>
        <Box h={1}></Box>

        <Select
          color={!payoutDay ? "gray" : "black"}
          placeholder="Choose an option..."
          onChange={(e) => setPayoutDay(DayOfTheWeek[e.target.value])}
        >
          {Object.values(DayOfTheWeek).map((dayOfWeek, i) => (
            <option key={i} value={dayOfWeek}>
              {dayOfWeek}
            </option>
          ))}
        </Select>
      </Flex>

      <UserPaymentHistory />
    </Flex>
  );
};

export default PaymentSettingsWidget;
