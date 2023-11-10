import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { auth } from "./config/firebase";
import routes from "./config/routes";
import Center from "./components/utils/Center";
import AuthChecker from "./components/auth/AuthChecker";
import * as React from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { GlobalStateProvider } from "./components/utils/GlobalState";
import { UserProvider } from "components/auth/UserProvider";

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
          <UserProvider>
            <ChakraProvider>
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      route.protected ? (
                        <AuthChecker adminOnly={route.adminOnly}>
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
          </UserProvider>
        </GlobalStateProvider>
      </BrowserRouter>
    </Box>
  );
}

export default App;
