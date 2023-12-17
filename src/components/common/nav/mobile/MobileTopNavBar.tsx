import React, { useContext } from "react";
import {
  Flex,
  Box,
  Text,
  Icon,
  Heading,
  Circle,
  Spinner,
} from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";
import { UserContext } from "components/auth/UserProvider";

interface TopNavBarProps {
  pageName: string;
}

const MobileTopNavBar: React.FC<TopNavBarProps> = ({ pageName }) => {
  const { currentUser } = useContext(UserContext);

  return (
    <Flex
      p={2}
      bg="#FAFAFA"
      alignItems={"center"}
      justifyContent={"space-between"}
      boxShadow={"0px 4px 6px rgba(0, 0, 0, 0.1)"}
      flex={1} // Add this line
      position={"fixed"}
      left={0}
      pl="15%"
      height={16}
      minWidth={"100vw"}
    >
      {/* Left-aligned Page Name */}

      <Heading pl={2} mx={2} size="md">
        {pageName}
      </Heading>

      {/* Right-aligned Profile section */}
      <Flex ml={8}>
        <Box mx={4} textAlign="right">
          <Text fontSize={"xs"}>{currentUser?.getFullName()}</Text>
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

export default MobileTopNavBar;
