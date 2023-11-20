import React, { useContext } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { UserContext } from "components/auth/UserProvider";
import { useGlobalState } from "components/utils/GlobalState";

const profilePictureSrc = null;

interface TopNavBarProps {
  pageName: string;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ pageName }) => {
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);

  const { activeTabIndex, setActiveTabIndex } = useGlobalState();

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

      <Button
        onClick={() => {
          setActiveTabIndex(0);
          navigate("/admin");
        }}
      >
        Admin Dashboard
      </Button>
      <Button
        onClick={() => {
          setActiveTabIndex(0);
          navigate("/");
        }}
      >
        User Dashboard
      </Button>

      {/* Right-aligned Profile section */}
      <Flex mx={8}>
        <Box mx={4} textAlign="right">
          <Text fontWeight="bold">{currentUser?.getFullName()}</Text>
          <Text fontSize="sm" color="gray.500">
            {currentUser?.isAdmin() ? "Administrator" : "Affiliate Agent"}
          </Text>
        </Box>

        {!currentUser ? (
          <Spinner />
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
