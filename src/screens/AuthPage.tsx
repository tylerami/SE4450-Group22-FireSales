import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Center from "../components/utils/Center";
import LoginContainer from "../components/auth/LoginContainer";
import RegistrationContainer from "../components/auth/RegistrationContainer";
import { Box, Flex } from "@chakra-ui/react";
import Logo from "../components/utils/Logo";

const AuthPage = (props) => {
  // getting and setting URL params
  const [searchParams, setSearchParams] = useSearchParams();

  // get action from URL
  const action = searchParams.get("action") || "login";

  const goToLogin = () => {
    setSearchParams({ action: "login" });
  };

  const goToRegister = () => {
    console.log("goToRegister");
    setSearchParams({ action: "register" });
  };

  return (
    <Flex
      p={10}
      height="100%"
      width="100%"
      background={"#ECEFF3"}
      alignItems={"center"}
      justifyContent={"start"}
      flexDirection={"column"}
      overflow="auto" // or overflow="scroll"
    >
      <Logo></Logo>
      <Box minHeight={6}></Box>
      {action === "register" ? (
        <RegistrationContainer goToLogin={goToLogin}></RegistrationContainer>
      ) : (
        <LoginContainer goToRegister={goToRegister}></LoginContainer>
      )}
    </Flex>
  );
};

export default AuthPage;
