import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Link,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { FcGoogle } from "react-icons/fc";
import { authService } from "services/implementations/AuthFirebaseService";
import { useGlobalState } from "components/utils/GlobalState";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";
import { User } from "@models/User";
import { UserService } from "services/interfaces/UserService";
import Logo from "components/common/Logo";

const COMP_GROUP_ID_FOR_ASSIGNED_USERS = "newbies-A";

const RegistrationContainer = ({ goToLogin = () => {} }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const userService: UserService = DependencyInjection.userService();

  const { setActiveTabIndex } = useGlobalState();

  const { setCurrentUser } = useContext(UserContext);

  // implement auth service here
  const signInWithGoogle = async () => {
    if (
      registrationCode.trim() !== "" &&
      !conversionService.isAssignmentCodeValid(registrationCode.trim())
    ) {
      setErrorMessage("Invalid registration code.");
      return;
    }

    setDisabled(true);
    let user;
    try {
      user = await authService.signInWithGoogle();
    } catch (e: any) {
      setErrorMessage(e.message);
      setDisabled(false);
      return;
    }

    if (user) {
      setCurrentUser(user);
      navigate("/");
      setActiveTabIndex(0);
      if (registrationCode.trim() !== "") {
        await handleRegistrationCodeUsed(user);
      }
    } else {
      setErrorMessage("Error signing in with Google");
    }
    setDisabled(false);
  };

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateRegistration = (): boolean => {
    if (
      [
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        password.trim(),
        confirmPassword.trim(),
      ].includes("")
    ) {
      setErrorMessage("Please fill in all required fields.");
      return false;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }
    if (!acceptedTerms) {
      setErrorMessage("Please accept the terms and conditions");
      return false;
    }
    return true;
  };

  const register = async () => {
    if (!validateRegistration()) return;

    if (
      registrationCode.trim() !== "" &&
      !conversionService.isAssignmentCodeValid(registrationCode.trim())
    ) {
      setErrorMessage("Invalid registration code.");
      return;
    }

    setDisabled(true);
    let user;
    try {
      user = await authService.registerWithEmail({
        email,
        password,
        firstName,
        lastName,
      });
    } catch (e: any) {
      setErrorMessage(e.message);
      setDisabled(false);
      return;
    }
    if (user) {
      setCurrentUser(user);
      navigate("/");
      setActiveTabIndex(0);
      if (registrationCode.trim() !== "") {
        await handleRegistrationCodeUsed(user);
      }
    } else {
      setErrorMessage("Error occurred during registration.");
    }

    setDisabled(false);
  };

  const handleRegistrationCodeUsed = async (user: User) => {
    await userService.update({
      ...user,
      compensationGroupId: COMP_GROUP_ID_FOR_ASSIGNED_USERS,
    });
    return await conversionService.assignConversionsWithCode({
      assignmentCode: registrationCode.trim(),
      userId: user.uid,
    });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Flex
      p={10}
      pt={6}
      borderRadius={"16"}
      width={"30em"}
      alignItems={"center"}
      flexDirection={"column"}
      background={"white"}
    >
      <Logo size="5em" />
      <Box h={6} />
      <Heading size="lg">Sign up</Heading>
      <Box h={3} />
      <Flex>
        <Text fontSize={"0.8em"}>Already have an account? </Text>
        <Text
          fontSize={"0.8em"}
          cursor={"pointer"}
          _hover={{ filter: "brightness(1.1)" }}
          color="#ED7D31"
          ml={1}
          fontWeight={600}
          onClick={goToLogin}
        >
          Sign in here
        </Text>
      </Flex>
      <Box h={8} />
      {/* name input group */}
      <Flex width={"100%"} justifyContent={"space-between"}>
        <Flex width={"48%"} flexDirection={"column"}>
          <Text color="gray" fontSize="0.8em">
            First name*
          </Text>
          <Box h={1}></Box>

          <InputGroup>
            <Input
              focusBorderColor="#ED7D31"
              variant={"outline"}
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></Input>
          </InputGroup>
        </Flex>

        <Flex width={"48%"} flexDirection={"column"}>
          <Text color="gray" fontSize="0.8em">
            Last name*
          </Text>
          <Box h={1}></Box>

          <InputGroup>
            <Input
              focusBorderColor="#ED7D31"
              variant={"outline"}
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></Input>
          </InputGroup>
        </Flex>
      </Flex>
      <Box h={4} />
      {/* email input group */}
      <Flex width={"100%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Email*
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
        </InputGroup>
      </Flex>
      <Box h={4} />
      {/* password input group  */}
      <Flex width={"100%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Password*
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement>
            <Icon
              _hover={{ color: "#434343" }}
              cursor={"pointer"}
              as={showPassword ? FiEyeOff : FiEye}
              onClick={handleShowPassword}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Box h={4} />
      {/* confirm password input group  */}
      <Flex width={"100%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Confirm password*
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Input>
          <InputRightElement>
            <Icon
              _hover={{ color: "#434343" }}
              cursor={"pointer"}
              as={showConfirmPassword ? FiEyeOff : FiEye}
              onClick={handleShowConfirmPassword}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Box h={4} />
      {/* Registration code  */}
      <Flex width={"100%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Do you have a registration code? (Optional)
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            placeholder="Registration code"
            value={registrationCode}
            onChange={(e) => setRegistrationCode(e.target.value)}
          ></Input>
        </InputGroup>
      </Flex>
      <Box h={6} />
      <Flex align="center" mt={4}>
        <Checkbox
          isChecked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          mr={4}
        />
        <Text fontSize="sm">
          By clicking Create an account, I agree that I have read and accepted
          the{" "}
          <Link href="https://example.com/terms" color="orange.500" isExternal>
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link
            href="https://example.com/privacy"
            color="orange.500"
            isExternal
          >
            Privacy Policy
          </Link>
          .
        </Text>
      </Flex>
      <Box h={6} />
      {/* sign up button */}
      <Button
        width={"100%"}
        isLoading={disabled}
        background="#ED7D31"
        color="white"
        onClick={register}
        _hover={{ filter: "brightness(1.1)" }}
        cursor={"pointer"}
      >
        Create an account
      </Button>
      <Box h={2} />
      {errorMessage && (
        <Text color="red" my={1}>
          {errorMessage}
        </Text>
      )}
      {/* button divider */}
      <Flex w="100%" alignItems={"center"} justifyContent={"space-between"}>
        <Box w="45%" h="1px" background="black" opacity={0.2} />
        <Text fontSize={"0.6em"} color="black" opacity={0.3}>
          {" "}
          Or{" "}
        </Text>
        <Box w="45%" h="1px" background="black" opacity={0.2} />{" "}
      </Flex>
      <Box h={4} />
      {/* google sign in button */}
      <Button
        leftIcon={<FcGoogle />}
        onClick={signInWithGoogle}
        w="full"
        maxW="md"
        colorScheme="gray"
      >
        Sign in with Google
      </Button>
    </Flex>
  );
};

export default RegistrationContainer;
