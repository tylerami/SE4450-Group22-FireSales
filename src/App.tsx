import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { auth } from "./config/firebase";
import routes from "./config/routes";
import Center from "./components/utils/Center";
import AuthChecker from "./components/auth/AuthChecker";
import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Input,
  Heading,
} from "@chakra-ui/react";
import { GlobalStateProvider } from "./components/utils/GlobalState";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.info("User detected.");
      } else {
        console.info("No user detected");
      }
      setLoading(false);
    });
  }, []);

  // add loading indicator
  if (loading) return <Center></Center>;

  return (
    <Box h={"100vh"} background="red">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <GlobalStateProvider>
          <ChakraProvider>
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    route.protected ? (
                      <AuthChecker>
                        <route.component />
                      </AuthChecker>
                    ) : (
                      <route.component />
                    )
                  }
                />
              ))}
            </Routes>
          </ChakraProvider>
        </GlobalStateProvider>
      </BrowserRouter>
    </Box>

    // <ChakraProvider theme={theme}>
    //   <Box textAlign="center" fontSize="xl">
    //     <Grid minH="100vh" p={3}>
    //       <VStack spacing={8}>
    //         <Text>
    //           Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
    //         </Text>
    //         <Link
    //           color="teal.500"
    //           href="https://chakra-ui.com"
    //           fontSize="2xl"
    //           target="_blank"
    //           rel="noopener noreferrer"
    //         >
    //           Learn Chakra
    //         </Link>
    //         <Heading size="2xl">asdf</Heading>
    //         <Input variant={"outline"}></Input>
    //       </VStack>
    //     </Grid>
    //   </Box>
    // </ChakraProvider>
  );
}

export default App;
