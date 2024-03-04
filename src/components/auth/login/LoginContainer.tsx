import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useGlobalState } from "components/utils/GlobalState";
import { authService } from "services/implementations/AuthFirebaseService";
import { User } from "src/models/User";
import Logo from "components/common/Logo";
import { UserContext } from "components/auth/UserProvider";

const LoginContainer = ({ goToRegister = () => {} }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setActiveTabIndex } = useGlobalState();

  const { setCurrentUser } = useContext(UserContext);

  // implement auth service here
  const signInWithGoogle = async () => {
    setDisabled(true);

    let user: User | null;
    try {
      user = await authService.signInWithGoogle();
      console.log(user);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.message);
      setDisabled(false);
      return;
    }

    if (user) {
      setCurrentUser(user);
      navigate("/");
      setActiveTabIndex(0);
    } else {
      setErrorMessage("Invalid email or password");
    }

    setDisabled(false);
  };

  const signInManually = async () => {
    setDisabled(true);

    let user: User | null;
    try {
      console.log(email, password);
      user = await authService.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.message);
      setDisabled(false);
      return;
    }
    console.log(user);

    if (user) {
      setCurrentUser(user);
      navigate("/");
      setActiveTabIndex(0);
    } else {
      setErrorMessage("Invalid email or password");
    }

    setDisabled(false);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
      <Box h={2} />

      {errorMessage && (
        <Text color="red" fontSize="0.8em">
          {errorMessage}
        </Text>
      )}

      <Box h={2} />

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
