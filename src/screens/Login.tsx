import React from "react";
import { useSearchParams } from "react-router-dom";
import Center from "../components/utils/Center";
import LoginContainer from "../components/auth/LoginContainer";
import RegistrationContainer from "../components/auth/RegistrationContainer";

const tabIdToURL = {
  0: "login",
  1: "register",
};

const Login = (props) => {
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

  return (
    // <Box width="100%">
    //   <Center>
    //     <Box
    //       display={"flex"}
    //       alignItems={"center"}
    //       flexDirection={"column"}
    //       boxShadow={2}
    //       margin={3}
    //       borderRadius={4}
    //     >
    //       <Box
    //         sx={{
    //           borderBottom: 1,
    //           borderColor: "divider",
    //           padding: "2px",
    //           width: "100%",
    //         }}
    //       >
    //         <Tabs
    //           value={value}
    //           onChange={handleChange}
    //           variant="fullWidth"
    //           sx={{ "& .MuiTab-root": { padding: "12px 24px" } }}
    //         >
    //           <Tab label="Login" />
    //           <Tab label="Register" />
    //         </Tabs>
    //       </Box>
    //       {/* login */}
    //       <TabPanel
    //         value={value}
    //         index={0}
    //         sx={{
    //           margin: "16px",
    //           borderRadius: "4px",
    //         }}
    //       >
    //         <LoginContainer />
    //       </TabPanel>
    //       {/* register */}
    //       <TabPanel
    //         value={value}
    //         index={1}
    //         sx={{
    //           margin: "16px",
    //           borderRadius: "4px",
    //         }}
    //       >
    //         <RegistrationContainer />
    //       </TabPanel>
    //     </Box>
    //   </Center>
    // </Box>
    <></>
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

export default Login;
