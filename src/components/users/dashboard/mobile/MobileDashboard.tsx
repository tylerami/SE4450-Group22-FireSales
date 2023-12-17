import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import { Tab } from "components/common/nav/Tab";
import MobileSideNavBar from "components/common/nav/mobile/MobileSideNavBar";
import React, { useContext } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { MdTrendingUp } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { authService } from "services/implementations/AuthFirebaseService";
import MobileDashboardPage from "./MobileDashboardPage";
import MobileConversionsPage from "components/users/conversions/mobile/MobileConversionsPage";
import { useGlobalState } from "components/utils/GlobalState";
import { UserContext } from "components/auth/UserProvider";
import MobileTopNavBar from "components/common/nav/mobile/MobileTopNavBar";

type Props = {};

const MobileDashboard = (props: Props) => {
  const navigate = useNavigate();

  const { activeTabIndex, setActiveTabIndex } = useGlobalState();

  const { currentUser } = useContext(UserContext);

  const sideNavWidth = "15%";

  const userTabs: Tab[] = [
    {
      name: "Dashboard",
      icon: AiOutlineDashboard,
      content: <MobileDashboardPage />,
      onClick: () => setActiveTabIndex(0),
    },
    {
      name: "Conversions",
      icon: MdTrendingUp,
      content: <MobileConversionsPage />,
      onClick: () => setActiveTabIndex(1),
    },
    {
      name: "Sign Out",
      icon: RiLogoutBoxRLine,
      onClick: () => authService.signOut(() => navigate("/login")),
    },
  ];

  document.body.style.overflow = "hidden";

  return (
    <Flex bg="#FAFAFA" overflow={"hidden"}>
      <MobileSideNavBar tabs={userTabs} />

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
          <MobileTopNavBar pageName={userTabs[activeTabIndex].name} />
        </Box>

        {/* Main page content */}
        {currentUser ? (
          <Flex
            mt={16}
            direction="column"
            alignItems={"center"}
            overflowY="auto" // Scrollable vertically if content overflows
            overflowX={"hidden"}
            flex="1"
          >
            {userTabs[activeTabIndex].content}
          </Flex>
        ) : (
          <Flex
            w="100%"
            alignItems={"center"}
            justifyContent={"center"}
            direction={"column"}
            gap={6}
            h="100%"
          >
            <Heading>Loading Account...</Heading>

            <Spinner size="xl" />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default MobileDashboard;
