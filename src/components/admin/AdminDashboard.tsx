import React from "react";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import SideNavBar from "components/common/nav/SideNavBar";
import TopNavBar from "components/common/nav/TopNavBar";
import { useGlobalState } from "components/utils/GlobalState";
import { MdMonetizationOn } from "react-icons/md";
import { BiAnalyse } from "react-icons/bi";
import { IoMdPeople } from "react-icons/io";
import { FaMoneyBillWave, FaReceipt, FaRegHandshake } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "config/firebase";
import PerformancePage from "./performance/PerformancePage";
import AdminSalesTeamPage from "./sales/AdminSalesTeamPage";
import AdminClientsPage from "./clients/AdminClientsPage";
import CompensationGroupsPage from "./compensation_groups/CompensationGroupsPage";
import { Tab } from "components/common/nav/Tab";
import AdminRecordConversionsPage from "./conversions/AdminRecordConversionsPage";
import PayoutsPage from "./payouts/PayoutsPage";
import MobileAdminDashboard from "./mobile/MobileAdminDashboard";

const AdminDashboard = (props) => {
  // Assuming the SideNavBar has a fixed width for simplicity
  const sideNavWidth = "14em"; // or 224px, or any other unit

  const navigate = useNavigate();

  const { activeTabIndex, setActiveTabIndex } = useGlobalState();

  const adminTabs: Tab[] = [
    {
      name: "Performance",
      icon: BiAnalyse,
      content: <PerformancePage />,
      onClick: () => setActiveTabIndex(0),
    },
    {
      name: "Sales Team",
      icon: IoMdPeople,
      content: <AdminSalesTeamPage />,
      onClick: () => setActiveTabIndex(1),
    },

    {
      name: "Clients",
      icon: FaRegHandshake,
      content: <AdminClientsPage />,
      onClick: () => setActiveTabIndex(2),
    },

    {
      name: "Sales Groups",
      icon: MdMonetizationOn,
      content: <CompensationGroupsPage />,
      onClick: () => setActiveTabIndex(3),
    },
    {
      name: "Conversions",
      icon: FaReceipt,
      content: <AdminRecordConversionsPage />,
      onClick: () => setActiveTabIndex(4),
    },
    {
      name: "Payouts",
      icon: FaMoneyBillWave,
      content: <PayoutsPage />,
      onClick: () => setActiveTabIndex(5),
    },
    {
      name: "Sign Out",
      icon: RiLogoutBoxRLine,
      onClick: () =>
        signOut(auth).then(() => {
          navigate("/login");
        }),
    },
  ];

  const isMobile = useBreakpointValue({ base: true, sm: false });

  if (isMobile) {
    return <MobileAdminDashboard />;
  }

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
        <SideNavBar tabs={adminTabs} />
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
          <TopNavBar pageName={adminTabs[activeTabIndex].name} />
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
          {adminTabs[activeTabIndex].content}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AdminDashboard;
