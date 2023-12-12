import React from "react";
import { useSearchParams } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import CollageBG from "assets/ht_collage.png";
import MobileRegistrationContainer from "./MobileRegistrationContainer";
import MobileLoginContainer from "./MobileLoginContainer";

const MobileAuthPage = (props) => {
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
        p={6}
        height="100%"
        width="100%"
        maxWidth={"100%"}
        alignItems={"center"}
        justifyContent={"start"}
        flexDirection={"row"}
        overflow="auto"
        style={{ position: "relative", zIndex: 2 }} // Ensure this is above the background
      >
        {action === "register" ? (
          <MobileRegistrationContainer goToLogin={goToLogin} />
        ) : (
          <MobileLoginContainer goToRegister={goToRegister} />
        )}
      </Flex>
    </div>
  );
};

export default MobileAuthPage;
