import React from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import TopNavBar from "../common/nav/TopNavBar";
import UserDashboardPage from "./dashboard/UserDashboardPage";
import { useGlobalState } from "../utils/GlobalState";
import ConversionsPage from "./conversions/ConversionsPage";
import UserSettingsPage from "./settings/UserSettingsPage";
import { AiOutlineDashboard } from "react-icons/ai";
import { MdSettings, MdTrendingUp } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { signOut } from "firebase/auth";
import { Tab } from "components/common/nav/Tab";
import SideNavBar from "components/common/nav/SideNavBar";
import { auth } from "config/firebase";
import { useNavigate } from "react-router-dom";

type Props = {};

const UserDashboard = (props: Props) => {
  const sideNavWidth = "14em"; // or 224px, or any other unit

  const { activeTabIndex, setActiveTabIndex } = useGlobalState();

  const navigate = useNavigate();

  const userTabs: Tab[] = [
    {
      name: "Dashboard",
      icon: AiOutlineDashboard,
      content: <UserDashboardPage />,
      onClick: () => setActiveTabIndex(0),
    },
    {
      name: "Conversions",
      icon: MdTrendingUp,
      content: <ConversionsPage />,
      onClick: () => setActiveTabIndex(1),
    },
    {
      name: "Settings",
      icon: MdSettings,
      content: <UserSettingsPage />,
      onClick: () => setActiveTabIndex(2),
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
        <SideNavBar tabs={userTabs} />
      </Box>

      {/* Main content area - padding left equals the width of the SideNavBar */}
      <Flex
        pl={sideNavWidth}
        w={`100vw`} // Width minus sidear width
        direction="column"
        h="100vh"
        overflowY="auto" // Scrollable vertically if content overflows
      >
        {/* Top Navigation Bar - spans the width minus the sidebar */}
        <Box w="full">
          <TopNavBar pageName={userTabs[activeTabIndex].name} />
        </Box>

        {/* Main page content */}
        <Flex
          direction="column"
          alignItems={"center"}
          overflowY="auto" // Scrollable vertically if content overflows
          overflowX={"hidden"}
          flex="1"
        >
          {userTabs[activeTabIndex].content}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserDashboard;
