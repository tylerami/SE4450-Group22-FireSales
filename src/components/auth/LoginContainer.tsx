import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, Providers } from "../../config/firebase";
import Center from "../utils/Center";
import {
  Box,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";

const LoginContainer = (props) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      width={"30em"}
      height={"60%"}
      alignItems={"center"}
      flexDirection={"column"}
      background={"white"}
    >
      <Heading>Sign In</Heading>
      <Box h={6} />

      <Flex>
        <Text>Don't have an account yet?</Text>
        <Text>Sign up here</Text>
      </Flex>

      <Box h={20} />

      <Flex width={"100%"} flexDirection={"column"}>
        <Input variant={"outline"} placeholder="Email"></Input>
      </Flex>

      <Flex width={"100%"} flexDirection={"column"}>
        <InputGroup>
          <Input
            variant={"outline"}
            type="password"
            placeholder="Password"
          ></Input>
          <InputRightElement>
            <Icon as={FiEye} />
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Flex>
  );
};

export default LoginContainer;
