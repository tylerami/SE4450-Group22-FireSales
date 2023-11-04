import React from "react";
import { Box, Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface SideNavBarButtonProps {
  active: boolean;
  buttonText: string;
  Icon: IconType;
}

const SideNavBarButton: React.FC<SideNavBarButtonProps> = ({
  active,
  buttonText,
  Icon,
}) => {
  // Define colors based on the `active` prop
  const bgColor = active ? "#ED7D31" : "transparent";
  const color = active ? "white" : "black";
  const iconColor = active ? "gray.700" : "black";

  return (
    <Flex
      align="center"
      p={10}
      pl={20}
      m={20}
      w={"80%"}
      background={bgColor}
      borderRadius="10px"
      justifyContent={"start"}
      role="group"
      cursor="pointer"
      _hover={{ bg: "#CA6623" }}
      transition="background 0.3s"
    >
      <Icon color={iconColor} size="2em" />
      <Box w={30}></Box>
      <Heading as="h4" fontWeight={"600"} color={color} ml="4">
        {buttonText}
      </Heading>
      <Box w={10}></Box>
    </Flex>
  );
};

export default SideNavBarButton;
