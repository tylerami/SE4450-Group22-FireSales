import React, { useEffect } from "react";
import SalesSubmissionForm from "../components/sales/SalesSubmissionForm";
import NavigationBar from "../components/nav/TopNavBar";
import { Flex, Heading, Stack } from "@chakra-ui/react";
import SideNavBar from "../components/nav/SideNavBar";

const Home = (props) => {
  useEffect(() => {}, []);

  return (
    <Flex height="100vh" width="100%" flexDirection={"row"}>
      <SideNavBar></SideNavBar>
      <NavigationBar username="tylerami" onLogout={() => {}}></NavigationBar>
      <SalesSubmissionForm />
    </Flex>
  );
};

export default Home;
