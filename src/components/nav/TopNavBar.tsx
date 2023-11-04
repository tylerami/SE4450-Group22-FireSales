import React from "react";
import {
  Flex,
  Box,
  Input,
  Avatar,
  Text,
  Icon,
  Spacer,
  Heading,
  InputGroup,
  InputRightElement,
  InputLeftElement,
} from "@chakra-ui/react";
import { FiSearch, FiUser } from "react-icons/fi";

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
      p={6}
      alignItems={"center"}
      justifyContent={"space-between"}
      boxShadow={"0px 4px 6px rgba(0, 0, 0, 0.1)"}
      flex={1} // Add this line
    >
      <Box w={5}></Box>
      {/* Left-aligned Page Name */}
      <Heading size="lg">{pageName}</Heading>

      <InputGroup maxWidth="30em">
        <InputLeftElement>
          <Icon _hover={{ color: "#434343" }} as={FiSearch} />
        </InputLeftElement>
        <Input
          focusBorderColor="#ED7D31"
          variant={"filled"}
          placeholder="Search..."
        ></Input>
      </InputGroup>

      {/* Right-aligned Profile section */}
      <Flex background={"red"}>
        {profileImageSrc && (
          <Avatar name={userName} src={profileImageSrc} size="sm" />
        )}
        {!profileImageSrc && <Icon as={FiUser} />}
        <Box textAlign="right">
          <Text fontWeight="bold">{userName}</Text>
          <Text fontSize="sm" color="gray.500">
            {userRole}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default TopNavBar;
