import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Providers, auth } from "../../../config/firebase";
import Center from "../../utils/Center";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
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
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { FcGoogle } from "react-icons/fc";

const RegistrationContainer = ({ goToLogin = () => {} }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // implement auth service here
  const signInWithGoogle = () => {
    setDisabled(true);
    signInWithPopup(auth, Providers.google)
      .then(() => {
        setDisabled(false);
        console.info("TODO: navigate to authenticated screen");
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage(error.code + ": " + error.message);
        setDisabled(false);
      });
  };

  const register = () => {
    setDisabled(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setDisabled(false);
        console.info("TODO: navigate to authenticated screen");
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage(error.code + ": " + error.message);
        setDisabled(false);
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
      borderRadius={"16"}
      width={"30em"}
      alignItems={"center"}
      flexDirection={"column"}
      background={"white"}
    >
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
            First name
          </Text>
          <Box h={1}></Box>

          <InputGroup>
            <Input
              focusBorderColor="#ED7D31"
              variant={"outline"}
              placeholder="First name"
            ></Input>
          </InputGroup>
        </Flex>

        <Flex width={"48%"} flexDirection={"column"}>
          <Text color="gray" fontSize="0.8em">
            Last name
          </Text>
          <Box h={1}></Box>

          <InputGroup>
            <Input
              focusBorderColor="#ED7D31"
              variant={"outline"}
              placeholder="Last name"
            ></Input>
          </InputGroup>
        </Flex>
      </Flex>

      <Box h={4} />

      {/* email input group */}
      <Flex width={"100%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Email
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            placeholder="Email"
          ></Input>
        </InputGroup>
      </Flex>

      <Box h={4} />

      {/* password input group  */}
      <Flex width={"100%"} flexDirection={"column"}>
        <Text color="gray" fontSize="0.8em">
          Password
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
          Confirm password
        </Text>
        <Box h={1}></Box>

        <InputGroup>
          <Input
            focusBorderColor="#ED7D31"
            variant={"outline"}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      <Box h={6} />

      <Flex align="center" mt={4}>
        <Checkbox mr={4} />
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
        background="#ED7D31"
        color="white"
        _hover={{ filter: "brightness(1.1)" }}
        cursor={"pointer"}
      >
        Create an account
      </Button>

      <Box h={4} />

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
