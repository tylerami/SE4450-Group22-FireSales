import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { User } from "models/User";
import { UserContext } from "components/auth/UserProvider";
import React, { useContext, useState } from "react";
import { UserService } from "services/interfaces/UserService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import useSuccessNotification from "components/utils/SuccessNotification";

type Props = {};

const AccountSettingsWidget = (props: Props) => {
  const { currentUser } = useContext(UserContext);

  const userService: UserService = DependencyInjection.userService();

  const showSuccess = useSuccessNotification();

  const saveChanges = async () => {
    if (!currentUser) return;

    const updatedUser: Partial<User> = {
      uid: currentUser.uid,
      phone: phoneNumber,
      email: primaryEmail,
      firstName: fullName.split(" ")[0],
      lastName: fullName.split(" ")[1],
    };

    const result = await userService.update(updatedUser);
    if (result) {
      showSuccess({ message: "Changes saved successfully!" });
    }
  };

  const changesMade = () => {
    if (!currentUser) return false;

    return (
      fullName !== currentUser.getFullName() ||
      primaryEmail !== currentUser.email ||
      phoneNumber !== (currentUser.phone ?? "")
    );
  };

  const [fullName, setFullName] = useState<string>(
    currentUser?.getFullName() || ""
  );

  const [primaryEmail, setPrimaryEmail] = useState<string>(
    currentUser?.email || ""
  );

  const [phoneNumber, setPhoneNumber] = useState<string>(
    currentUser?.phone || ""
  );

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
          Account Settings
        </Heading>

        <Button onClick={saveChanges} isDisabled={!changesMade()}>
          {" "}
          Save Changes
        </Button>
      </Flex>
      <Flex width={"48%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Full name*
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            placeholder="Full name"
            defaultValue={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </InputGroup>
      </Flex>
      <Flex width={"48%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Primary email*
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            placeholder="Primary email"
            defaultValue={primaryEmail}
            onChange={(e) => setPrimaryEmail(e.target.value)}
          ></Input>
        </InputGroup>
      </Flex>
      <Flex width={"48%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Phone number
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            placeholder="Phone number"
            defaultValue={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></Input>
        </InputGroup>
      </Flex>
    </Flex>
  );
};

export default AccountSettingsWidget;
