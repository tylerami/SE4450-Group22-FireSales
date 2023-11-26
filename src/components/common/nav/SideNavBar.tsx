import { Flex } from "@chakra-ui/react";
import React from "react";

import { Box } from "@chakra-ui/react"; // Using Chakra UI for the box
import SideNavBarButton from "./SideNavBarButton";
import Logo from "components/common/Logo";
import { Tab } from "@components/common/nav/Tab";
import { useGlobalState } from "components/utils/GlobalState";

type Props = {
  tabs: Tab[];
};

const SideNavBar = ({ tabs }: Props) => {
  const heightInEm = tabs.length * 4 + 2;

  const { activeTabIndex } = useGlobalState();

  return (
    <Flex
      flex={1}
      width="15%"
      minWidth={"14em"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"start"}
      height={"100%"}
      overflowY={"auto"}
      background={"rgba(237, 125, 49, 0.26)"}
    >
      <Box minH={8} />
      <Logo size={"4em"}></Logo>
      <Box h={4} />

      <Flex
        width={"100%"}
        h="100%"
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
