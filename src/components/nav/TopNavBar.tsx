import React from "react";
import {
  Flex,
  Box,
  Avatar,
  Text,
  Icon,
  Heading,
  Circle,
  Image,
  Button,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <Flex
      p={6}
      alignItems={"center"}
      justifyContent={"space-between"}
      boxShadow={"0px 4px 6px rgba(0, 0, 0, 0.1)"}
      flex={1} // Add this line
    >
      {/* Left-aligned Page Name */}
      <Box w="20em">
        <Heading mx={2} size="lg">
          {pageName}
        </Heading>
      </Box>

      <Button onClick={() => navigate("/admin")}>Admin Dashboard</Button>
      <Button onClick={() => navigate("/")}>User Dashboard</Button>

      {/* Right-aligned Profile section */}
      <Flex mx={8}>
        <Box mx={4} textAlign="right">
          <Text fontWeight="bold">{userName}</Text>
          <Text fontSize="sm" color="gray.500">
            {userRole}
          </Text>
        </Box>
        {profileImageSrc && (
          <Avatar name={userName} src={profileImageSrc} size="sm" />
        )}
        {profilePictureSrc ? (
          <Image borderRadius="full" boxSize="40px" src={profilePictureSrc} />
        ) : (
          <Circle size="40px" bg="gray.200" mr={4}>
            <Icon as={FiUser} />
          </Circle>
        )}
      </Flex>
    </Flex>
  );
};

export default TopNavBar;
