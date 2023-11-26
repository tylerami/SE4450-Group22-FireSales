import React from "react";
import { Box, Button, Heading } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface SideNavBarButtonProps {
  active: boolean;
  buttonText: string;
  Icon: IconType;
  onClick?: () => void;
}

const SideNavBarButton: React.FC<SideNavBarButtonProps> = ({
  active,
  buttonText,
  Icon,
  onClick,
}) => {
  // Define colors based on the `active` prop
  const bgColor = active ? "#ED7D31" : "transparent";
  const color = active ? "white" : "gray.700";
  const iconColor = active ? "black" : "black";

  return (
    <Button
      onClick={onClick}
      background={bgColor}
      borderRadius="10px"
      w={"80%"}
      p={2}
      alignItems={"center"}
      justifyContent={"start"}
      cursor="pointer"
      color={color}
      _hover={{
        bg: "#ED7D31",
        color: "white", // Apply hover styles to the Icon and Heading as well
        ".icon-hover": { color: "black" },
        ".text-hover": { color: "white", opacity: "1" },
      }}
      transition="background 0.3s"
    >
      <Icon size="1.6em" color={iconColor} />
      <Box w={4}></Box>
      <Heading opacity={0.8} size="sm" fontWeight={"600"}>
        {buttonText}
      </Heading>
    </Button>
  );
};

export default SideNavBarButton;
