import React from "react";
import { useSearchParams } from "react-router-dom";
import Center from "../components/utils/Center";
import LoginContainer from "../components/auth/LoginContainer";
import RegistrationContainer from "../components/auth/RegistrationContainer";
import { Box, Flex } from "@chakra-ui/react";
import Logo from "../components/utils/Logo";

const tabIdToURL = {
  0: "login",
  1: "register",
};

const AuthPage = (props) => {
  // getting and setting URL params
  const [searchParams, setSearchParams] = useSearchParams();

  // get action from URL
  const action = searchParams.get("action") || "login";

  // used to set initial state
  let indexFromUrl = 0;
  if (action === "register") {
    indexFromUrl = 1;
  }

  // handle Tab Panel
  const [value, setValue] = React.useState(indexFromUrl);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const action = tabIdToURL[newValue];
    setSearchParams({ action });
  };

  // todo: factor out the background color
  return (
    <Flex
      height="100vh"
      width="100%"
      background={"#ECEFF3"}
      alignItems={"center"}
      justifyContent={"start"}
      flexDirection={"column"}
    >
      <Box h={60}></Box>

      <Logo size="3em"></Logo>
      <Box h={20}></Box>
      <LoginContainer></LoginContainer>
    </Flex>
  );
};

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <></>
        // <Box sx={{ p: 3 }}>
        //   <>{children}</>
        // </Box>
      )}
    </div>
  );
};

export default AuthPage;
