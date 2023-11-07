import { Flex, Heading, Stack } from "@chakra-ui/react";
import React, { useState } from "react";

import { IoMdFlame } from "react-icons/io"; // Import the flame icon
import { Box } from "@chakra-ui/react"; // Using Chakra UI for the box
import SideNavBarButton from "./SideNavBarButton";
import { MdDashboard } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiAnalyse } from "react-icons/bi";
import { IoMdPeople } from "react-icons/io";
import { FaRegHandshake } from "react-icons/fa";
import { MdSettings, MdTrendingUp } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import Logo from "../utils/Logo";
import { set } from "lodash";
import { useGlobalState } from "../utils/GlobalState";

type Props = object;

const UserSideNavBar = (props: Props) => {
  const navigate = useNavigate();

  const { activeTabIndex, setActiveTabIndex } = useGlobalState();

  const tabs = [
    {
      name: "Dashboard",
      icon: AiOutlineDashboard,
      onClick: () => setActiveTabIndex(0),
    },
    {
      name: "Conversions",
      icon: MdTrendingUp,
      onClick: () => setActiveTabIndex(1),
    },
    {
      name: "Settings",
      icon: MdSettings,
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
      <Logo size={"1.5em"}></Logo>
      <Box h={4} />

      <Flex
        width={"100%"}
        h="100%"
        maxHeight={"20em"}
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

export default UserSideNavBar;
