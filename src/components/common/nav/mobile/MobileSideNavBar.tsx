import { Flex, IconButton } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import { Box } from "@chakra-ui/react"; // Using Chakra UI for the box
import { Tab } from "@components/common/nav/Tab";
import { useGlobalState } from "components/utils/GlobalState";
import { HamburgerIcon, SmallCloseIcon } from "@chakra-ui/icons";
import SideNavBarButton from "../SideNavBarButton";

type Props = {
  tabs: Tab[];
};

const MobileSideNavBar = ({ tabs }: Props) => {
  const heightInEm = tabs.length * 4 + 2;

  const { activeTabIndex } = useGlobalState();

  const [collapsedState, setCollapsedState] = useState(true);

  const sideNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sideNavRef.current &&
        !sideNavRef.current.contains(event.target as Node)
      ) {
        setCollapsedState(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sideNavRef]);

  const collapsed = collapsedState;

  return (
    <Flex
      ref={sideNavRef}
      position={"fixed"}
      zIndex={20}
      left={0}
      flex={1}
      width={collapsed ? "15vw" : "60vw"}
      transition={"all 0.5s ease"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"start"}
      height={"100%"}
      overflowY={"auto"}
      background={"#FFDCBBCA"}
    >
      <Box minH={8} />
      <IconButton
        variant={"ghost"}
        _hover={{ background: "transparent", cursor: "pointer" }}
        focusable={false}
        background={"transparent"}
        as={collapsed ? HamburgerIcon : SmallCloseIcon}
        transition={"all 0.5s ease"}
        onClick={() => setCollapsedState(!collapsed)}
        aria-label=""
      />
      <Box h={4} />
      <Flex
        width={"100%"}
        h="100%"
        opacity={collapsed ? 0 : 1}
        transition={"all 0.5s ease"}
        maxHeight={`${heightInEm}em`}
        alignItems={"center"}
        flexDirection={"column"}
        justifyContent={"space-evenly"}
      >
        {!collapsed &&
          tabs.map((tab, index) => (
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
      <Box flexShrink={0} height={"1000px"} maxHeight={"30%"}></Box>
    </Flex>
  );
};

export default MobileSideNavBar;
