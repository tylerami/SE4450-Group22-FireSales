import { Flex, Heading, Stack } from "@chakra-ui/react";
import React from "react";

import { IoMdFlame } from "react-icons/io"; // Import the flame icon
import { Box } from "@chakra-ui/react"; // Using Chakra UI for the box
import SideNavBarButton from "./SideNavBarButton";
import { MdDashboard } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiAnalyse } from "react-icons/bi";
import { IoPeopleOutline } from "react-icons/io5";
import { GiCash } from "react-icons/gi";
import { MdSettings } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";

type Props = {};

const SideNavBar = (props: Props) => {
  return (
    <Flex
      width="20em"
      p={16}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"space-between"}
      height={"100%"}
      background={"rgba(237, 125, 49, 0.26)"}
    >
      <Flex mt={10} alignItems={"center"}>
        <IoMdFlame color="red" size="2.5em" />
        <Box w={10}></Box>
        <Heading fontWeight={700} fontSize={"2rem"} color="black" opacity={0.7}>
          FireSales
        </Heading>
      </Flex>
      <SideNavBarButton
        buttonText="Dashboard"
        Icon={AiOutlineDashboard}
        active={true}
      ></SideNavBarButton>

      <SideNavBarButton
        buttonText="Analytics"
        Icon={BiAnalyse}
        active={false}
      ></SideNavBarButton>
      <SideNavBarButton
        buttonText="Clients"
        Icon={IoPeopleOutline}
        active={false}
      ></SideNavBarButton>
      <SideNavBarButton
        buttonText="Sales Team"
        Icon={GiCash}
        active={false}
      ></SideNavBarButton>
      <SideNavBarButton
        buttonText="Settings"
        Icon={MdSettings}
        active={false}
      ></SideNavBarButton>
      <SideNavBarButton
        buttonText="Sign Out"
        Icon={RiLogoutBoxRLine}
        active={false}
      ></SideNavBarButton>
      <Box height={1000} maxHeight={"30%"}></Box>
    </Flex>
  );
};

export default SideNavBar;
