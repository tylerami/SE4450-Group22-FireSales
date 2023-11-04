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
  Circle,
  Image,
} from "@chakra-ui/react";
import { FiSearch, FiUser } from "react-icons/fi";

const profilePictureSrc = null;

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
      <Flex mr={8}>
        {profileImageSrc && (
          <Avatar name={userName} src={profileImageSrc} size="sm" />
        )}
        {profilePictureSrc ? (
          <Image
            borderRadius="full"
            boxSize="40px"
            src={profilePictureSrc}
            mr={4}
          />
        ) : (
          <Circle size="40px" bg="gray.200" mr={4}>
            <Icon as={FiUser} />
          </Circle>
        )}

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
