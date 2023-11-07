import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import TopNavBar from "../../components/nav/TopNavBar";
import UserSideNavBar from "../../components/nav/UserSideNavBar";
import UserDashboardPage from "../../components/users/dashboard/UserDashboardPage";
import { useGlobalState } from "../../components/utils/GlobalState";
import RecordConversionsPage from "../../components/users/conversions/RecordConversionsPage";

type Props = {};

const UserDashboard = (props: Props) => {
  const sideNavWidth = "14em"; // or 224px, or any other unit

  const { activeTabIndex } = useGlobalState();

  const contentTabs = [<UserDashboardPage />, <RecordConversionsPage />];

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
        w={`100vw`} // Width minus sidebar width
        direction="column"
        h="100vh"
        overflowY="auto" // Scrollable vertically if content overflows
      >
        {/* Top Navigation Bar - spans the width minus the sidebar */}
        <Box w="full">
          <TopNavBar
            pageName={activeTabIndex === 0 ? "Dashboard" : "Conversion Logging"}
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
          {contentTabs[activeTabIndex]}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserDashboard;
