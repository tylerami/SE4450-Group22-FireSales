import React, { useEffect } from "react";
import SalesSubmissionForm from "../components/sales/SalesSubmissionForm";
import NavigationBar from "../components/nav/TopNavBar";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import SideNavBar from "../components/nav/SideNavBar";
import TopNavBar from "../components/nav/TopNavBar";
import PerformanceChartWidget from "../components/admin/PerformanceChartWidget";
import PerformanceTableWidget from "../components/admin/PerformanceTableWidget";
import SalesTeamTableWidget from "../components/admin/SalesTeamTableWidget";

const AdminHome = (props) => {
  return (
    <Flex
      height="100vh"
      width="100%"
      background={"#FAFAFA"}
      alignItems={"start"}
      flexDirection={"row"}
    >
      <SideNavBar></SideNavBar>

      {/* main container  */}
      <Flex flexDirection={"column"} width={"100%"} height="100%">
        <TopNavBar
          pageName="Dashboard"
          userName="Tyler Amirault"
          userRole="The Creator"
          profileImageSrc={null}
        ></TopNavBar>

        {/* welcome text  */}
        <Flex p={26}>
          <Heading fontSize="1.8em">Welcome, </Heading>
          <Heading fontSize="1.8em" fontWeight={700} color="#ED7D31">
            Tyler
          </Heading>
        </Flex>

        {/* row of widgets   */}
        <Flex height={"100%"}>
          {/* column performance chart and table  */}
          <Flex
            height={"100%"}
            width={"50%"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <PerformanceChartWidget />
            <Box h={20}></Box>
            <PerformanceTableWidget />
          </Flex>

          {/* sales team chart  */}
          <Flex
            width={"50%"}
            flexDirection={"column"}
            alignItems={"center"}
            height={"90%"}
          >
            <SalesTeamTableWidget />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AdminHome;
