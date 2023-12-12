import { Flex, IconButton, useBreakpointValue } from "@chakra-ui/react";
import React, { useState } from "react";

import { Box } from "@chakra-ui/react"; // Using Chakra UI for the box
import SideNavBarButton from "./SideNavBarButton";
import Logo from "components/common/Logo";
import { Tab } from "@components/common/nav/Tab";
import { useGlobalState } from "components/utils/GlobalState";
import { HamburgerIcon, SmallCloseIcon } from "@chakra-ui/icons";

type Props = {
  tabs: Tab[];
};

const SideNavBar = ({ tabs }: Props) => {
  const heightInEm = tabs.length * 4 + 2;

  const { activeTabIndex } = useGlobalState();

  const isCollapsable = useBreakpointValue({ base: true, md: false });

  const [collapsedState, setCollapsedState] = useState(
    isCollapsable ? true : false
  );

  const collapsed = isCollapsable && collapsedState;

  return (
    <Flex
      position={"sticky"}
      zIndex={1}
      left={0}
      flex={1}
      width={collapsed ? "10%" : "15%"}
      minWidth={collapsed ? "4em" : "14em"}
      transition={isCollapsable ? "all 0.5s ease" : undefined}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"start"}
      height={"100%"}
      overflowY={"auto"}
      background={"rgba(237, 125, 49, 0.26)"}
    >
      <Box minH={8} />
      {isCollapsable ? (
        <IconButton
          variant={"ghost"}
          _hover={{ background: "transparent", cursor: "pointer" }}
          focusable={false}
          background={"transparent"}
          as={collapsed ? HamburgerIcon : SmallCloseIcon}
          transition={isCollapsable ? "all 0.5s ease" : undefined}
          onClick={() => setCollapsedState(!collapsed)}
          aria-label=""
        />
      ) : (
        <Logo size={"4em"} />
      )}
      <Box h={4} />

      <Flex
        width={"100%"}
        h="100%"
        opacity={collapsed ? 0 : 1}
        transition={isCollapsable ? "all 0.5s ease" : undefined}
        maxHeight={`${heightInEm}em`}
        alignItems={"center"}
        flexDirection={"column"}
        justifyContent={"space-evenly"}
      >
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <Box h={6} />
            <SideNavBarButton
              active={index === activeTabIndex}
              buttonText={tab.name}
              Icon={tab.icon}
              onClick={tab.onClick}
            />
          </React.Fragment>
        ))}
      </Flex>

      {/* <Box height={1000} maxHeight={"30%"}></Box> */}
      <Box flexShrink={0} height={"1000px"} maxHeight={"30%"}></Box>
    </Flex>
  );
};

export default SideNavBar;
