import React from "react";
import { useSearchParams } from "react-router-dom";
import LoginContainer from "./login/LoginContainer";
import RegistrationContainer from "./register/RegistrationContainer";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import CollageBG from "assets/ht_collage.png";
import MobileAuthPage from "./mobile/MobileAuthPage";

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

  const isMobile = useBreakpointValue({ base: true, sm: false });

  if (isMobile) {
    return <MobileAuthPage />;
  }

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${CollageBG})`,
          backgroundRepeat: "repeat",
          filter: "brightness(0.4)", // Apply brightness filter here
          zIndex: 1,
        }}
      />
      <Flex
        p={10}
        height="100%"
        width="100%"
        alignItems={"center"}
        justifyContent={"start"}
        flexDirection={"column"}
        overflow="auto"
        style={{ position: "relative", zIndex: 2 }} // Ensure this is above the background
      >
        <Box minHeight={6}></Box>
        {action === "register" ? (
          <RegistrationContainer goToLogin={goToLogin}></RegistrationContainer>
        ) : (
          <LoginContainer goToRegister={goToRegister}></LoginContainer>
        )}
      </Flex>
    </div>
  );
};

export default AuthPage;
