import { Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import Announcement from "models/Announcement";
import { formatDateStringWithTime } from "models/utils/Date";

const UserAnnouncementTile = ({
  announcement,
}: {
  announcement: Announcement;
}) => {
  return (
    <Flex
      borderRadius={"12px"}
      border={"1px solid #D6D6D6"}
      w="full"
      gap={4}
      p={26}
      direction={"column"}
    >
      <Flex w="full">
        <Heading color={"#ED7D31"} fontSize={"md"}>
          {announcement.title}
        </Heading>
        <Spacer />
        <Text fontSize={"sm"}>
          {formatDateStringWithTime(announcement.createdAt)}
        </Text>
      </Flex>
      <Text fontSize={"sm"}>{announcement.body}</Text>
    </Flex>
  );
};

export default UserAnnouncementTile;
