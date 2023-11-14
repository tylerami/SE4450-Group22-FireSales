import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import AdminSideNavBar from "../nav/AdminSideNavBar";
import TopNavBar from "../nav/TopNavBar";
import SalesTeamTableWidget from "./dashboard/team/SalesTeamTableWidget";
import PerformanceChartWidget from "./dashboard/performance/PerformanceChartWidget";
import ClientsSummaryTableWidget from "./dashboard/clients/ClientsSummaryTableWidget";
import AdminDashboardPage from "./dashboard/AdminDashboardPage";
import AdminClientsPage from "./clients/AdminClientsPage";
import AdminSalesTeamPage from "./sales/AdminSalesTeamPage";
import { useGlobalState } from "../utils/GlobalState";

const AdminDashboard = (props) => {
  // Assuming the SideNavBar has a fixed width for simplicity
  const sideNavWidth = "14em"; // or 224px, or any other unit

  const { activeTabIndex } = useGlobalState();

  const tabs = [
    // {
    //   name: "Dashboard",
    //   content: <AdminDashboardPage />,
    // },
    {
      name: "Clients",
      content: <AdminClientsPage />,
    },
    {
      name: "Sales Team",
      content: <AdminSalesTeamPage />,
    },
  ];

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
        <AdminSideNavBar />
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
          <TopNavBar pageName={tabs[activeTabIndex].name} />
        </Box>

        {/* Welcome text */}

        {/* Main page content */}
        <Flex
          direction="column"
          alignItems={"center"}
          overflowY="auto" // Scrollable vertically if content overflows
          overflowX={"hidden"}
          flex={1}
        >
          {tabs[activeTabIndex].content}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AdminDashboard;
