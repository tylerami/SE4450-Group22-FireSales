import React, { useEffect } from "react";
import SalesSubmissionForm from "../components/sales/SalesSubmissionForm";
import NavigationBar from "../components/nav/TopNavBar";
import {
  Box,
  Flex,
  Heading,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import SideNavBar from "../components/nav/SideNavBar";
import TopNavBar from "../components/nav/TopNavBar";
import SalesTeamTableWidget from "../components/admin/dashboard/team/SalesTeamTableWidget";
import PerformanceChartWidget from "../components/admin/dashboard/performance/PerformanceChartWidget";
import ClientsSummaryTableWidget from "../components/admin/dashboard/clients/ClientsSummaryTableWidget";

const AdminHome = (props) => {
  // Assuming the SideNavBar has a fixed width for simplicity
  const sideNavWidth = "14em"; // or 224px, or any other unit

  return (
    <Flex
      h="100vh" // Full viewport height
      w="100vw" // Full viewport width
      bg="#FAFAFA"
      overflowX="hidden" // No horizontal scroll
    >
      {/* Side Navigation - fixed width and full height */}
      <Box
        position="fixed"
        left={0}
        top={0}
        h="100vh"
        w={sideNavWidth}
        overflowY="auto" // Scrollable vertically if content overflows
      >
        <SideNavBar />
      </Box>

      {/* Main content area - padding left equals the width of the SideNavBar */}
      <Flex
        pl={sideNavWidth}
        w={`100vw`} // Width minus sidebar width
        direction="column"
        h="100vh"
        overflowY="auto" // Scrollable vertically if content overflows
      >
        {/* Top Navigation Bar - spans the width minus the sidebar */}
        <Box w="full">
          <TopNavBar
            pageName="Dashboard"
            userName="Tyler Amirault"
            userRole="The Creator"
            profileImageSrc={null}
          />
        </Box>

        {/* Welcome text */}

        {/* Main page content */}
        <Flex
          direction="column"
          overflowY="auto" // Scrollable vertically if content overflows
          overflowX={"hidden"}
          flex="1"
        >
          <Flex px={8} py={6} align="center" wrap="wrap">
            <Heading fontSize="1.8em" mr={2}>
              Welcome,
            </Heading>
            <Heading fontSize="1.8em" fontWeight={700} color="#ED7D31">
              Tyler
            </Heading>
          </Flex>

          {/* Row of widgets */}
          <Flex
            width={"100%"}
            height={"100%"}
            direction={{ base: "column", xl: "row" }} // Stack on base, horizontal on larger screens
            gap={6}
            p={6}
          >
            {/* Column: Performance chart and table */}
            <Flex
              width={{ base: "100%", xl: "50%" }} // Full width on base, half on larger screens
              direction="column"
              gap={6}
              align="center"
            >
              <PerformanceChartWidget />
              <ClientsSummaryTableWidget />
            </Flex>

            {/* Sales team chart */}
            <Flex
              width={{ base: "100%", xl: "50%" }} // Full width on base, half on larger screens
              direction="column"
              align="center"
            >
              <SalesTeamTableWidget />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AdminHome;
