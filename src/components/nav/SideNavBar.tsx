import { Flex, Heading, Stack } from "@chakra-ui/react";
import React from "react";

import { IoMdFlame } from "react-icons/io"; // Import the flame icon
import { Box } from "@chakra-ui/react"; // Using Chakra UI for the box
import SideNavBarButton from "./SideNavBarButton";
import { MdDashboard } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiAnalyse } from "react-icons/bi";
import { IoMdPeople } from "react-icons/io";
import { GiCash } from "react-icons/gi";
import { MdSettings } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import Logo from "../utils/Logo";

type Props = object;

const SideNavBar = (props: Props) => {
  const navigate = useNavigate();

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
      <Logo></Logo>
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
        Icon={IoMdPeople}
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
        onClick={() =>
          signOut(auth).then(() => {
            navigate("/login");
          })
        }
        active={false}
      ></SideNavBarButton>
      <Box height={1000} maxHeight={"30%"}></Box>
    </Flex>
  );
};

export default SideNavBar;
