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
import React, { useState } from "react";
import { PaymentMethod } from "../../../models/enums/PaymentMethod";

type Props = {};

const PaymentSettingsWidget = (props: Props) => {
  const [payoutDay, setPayoutDay] = useState(null);

  const [paymentType, setPaymentType] = useState(PaymentMethod.etransfer);

  const payoutDayOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
    { value: "Sunday", label: "Sunday" },
  ];

  const handlePayoutDayChange = (e) => {
    setPayoutDay(e.target.value);
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const paymentTypeOptions: { value: PaymentMethod; label: string }[] = [
    { value: PaymentMethod.paypal, label: "Paypal" },
    { value: PaymentMethod.etransfer, label: "E-transfer" },
  ];

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

        <Button> Save Changes</Button>
      </Flex>

      <Flex width={"48%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Payment type*
        </Text>
        <Box h={1}></Box>

        <Select
          color={!paymentType ? "gray" : "black"}
          placeholder="Choose an option..."
          onChange={(e) => handlePaymentTypeChange(e)}
          value={paymentType}
        >
          {paymentTypeOptions.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
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
          onChange={(e) => handlePayoutDayChange(e)}
        >
          {payoutDayOptions.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Flex>
    </Flex>
  );
};

export default PaymentSettingsWidget;
