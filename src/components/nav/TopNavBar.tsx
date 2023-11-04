import React from "react";
import {
  Flex,
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  Avatar,
  Text,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Icon,
  Spacer,
} from "@chakra-ui/react";
import { FiUser, FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

interface TopNavBarProps {
  pageName: string;
  userName: string;
  userRole: string;
  profileImageSrc: string | null;
}

const TopNavBar: React.FC<TopNavBarProps> = ({
  pageName,
  userName,
  userRole,
  profileImageSrc,
}) => {
  return (
    <Flex
      p={20}
      alignItems={"center"}
      boxShadow={"0px 4px 6px rgba(0, 0, 0, 0.1)"}
      width={"100%"}
    >
      <Box w={5}></Box>
      {/* Left-aligned Page Name */}
      <Text fontSize="2em" fontWeight="bold">
        {pageName}
      </Text>

      <Spacer />

      <Input
        outline={"none"}
        _focus={{
          border: "solid 1px #FFFFFF",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
        }}
        transition={"all 0.1s ease-in-out"}
        textDecoration={"none"}
        border={"solid 1px transparent"}
        variant={"filled"}
        borderRadius={"12px"}
        background="#F3F3F3"
        width="40em"
        maxWidth={"50%"}
        p={12}
        placeholder="Search..."
      />

      <Spacer />

      {/* Right-aligned Profile section */}
      <Flex>
        {profileImageSrc && (
          <Avatar name={userName} src={profileImageSrc} size="sm" />
        )}
        {!profileImageSrc && <Icon as={FiUser} />}
        <Box ml={2} textAlign="right">
          <Text fontWeight="bold">{userName}</Text>
          <Text fontSize="sm" color="gray.500">
            {userRole}
          </Text>
        </Box>
      </Flex>
      <Box w={5}></Box>
    </Flex>
  );
};

export default TopNavBar;
