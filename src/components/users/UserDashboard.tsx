import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import TopNavBar from "../nav/TopNavBar";
import UserSideNavBar from "../nav/UserSideNavBar";
import UserDashboardPage from "./dashboard/UserDashboardPage";
import { useGlobalState } from "../utils/GlobalState";
import ConversionsPage from "./conversions/ConversionsPage";
import UserSettingsPage from "./settings/UserSettingsPage";

type Props = {};

const UserDashboard = (props: Props) => {
  const sideNavWidth = "14em"; // or 224px, or any other unit

  const { activeTabIndex } = useGlobalState();

  const contentTabs = [
    {
      name: "Dashboard",
      content: <UserDashboardPage />,
    },
    {
      name: "Conversion Logging",
      content: <ConversionsPage />,
    },
    {
      name: "Settings",
      content: <UserSettingsPage />,
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
        <UserSideNavBar />
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
          <TopNavBar
            pageName={contentTabs[activeTabIndex].name}
            userName="Ruan Badenhorst"
            userRole="Salesperson"
            profileImageSrc={null}
          />
        </Box>

        {/* Main page content */}
        <Flex
          direction="column"
          alignItems={"center"}
          overflowY="auto" // Scrollable vertically if content overflows
          overflowX={"hidden"}
          flex="1"
        >
          {contentTabs[activeTabIndex].content}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserDashboard;
