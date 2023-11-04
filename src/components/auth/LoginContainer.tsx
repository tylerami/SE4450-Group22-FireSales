import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, Providers } from "../../config/firebase";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { FcGoogle } from "react-icons/fc";

const LoginContainer = ({ goToRegister = () => {} }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const signInManually = () => {
    setDisabled(true);
    signInWithEmailAndPassword(auth, email, password)
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

  return (
    <Flex
      p={10}
      borderRadius={"16"}
      width={"30em"}
      alignItems={"center"}
      flexDirection={"column"}
      background={"white"}
    >
      <Heading size="lg">Sign in</Heading>
      <Box h={3} />
      <Flex>
        <Text fontSize={"0.8em"}>Don't have an account yet? </Text>

        <Text
          fontSize={"0.8em"}
          cursor={"pointer"}
          _hover={{ filter: "brightness(1.1)" }}
          color="#ED7D31"
          ml={1}
          onClick={goToRegister}
          fontWeight={600}
        >
          Sign up here
        </Text>
      </Flex>
      <Box h={12} />
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
              onClick={() => setShowPassword(!showPassword)}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>

      <Box h={4} />

      <Text
        fontSize="0.8em"
        alignSelf={"start"}
        cursor={"pointer"}
        _hover={{ filter: "brightness(1.1)" }}
        color="#ED7D31"
        ml={1}
        fontWeight={600}
      >
        Forgot password?
      </Text>

      <Box h={10} />

      <Button
        width={"100%"}
        background="#ED7D31"
        color="white"
        _hover={{ filter: "brightness(1.1)" }}
        cursor={"pointer"}
        onClick={signInManually}
        disabled={disabled}
      >
        Sign in
      </Button>

      <Box h={4} />

      <Flex w="100%" alignItems={"center"} justifyContent={"space-between"}>
        <Box w="45%" h="1px" background="black" opacity={0.2} />
        <Text fontSize={"0.6em"} color="black" opacity={0.3}>
          {" "}
          Or{" "}
        </Text>
        <Box w="45%" h="1px" background="black" opacity={0.2} />{" "}
      </Flex>

      <Box h={4} />

      <Button
        leftIcon={<FcGoogle />}
        onClick={signInWithGoogle}
        w="full"
        maxW="md"
        colorScheme="gray"
        disabled={disabled}
      >
        Sign in with Google
      </Button>
    </Flex>
  );
};

export default LoginContainer;
