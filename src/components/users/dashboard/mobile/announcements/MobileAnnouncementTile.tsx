import { Flex, Heading, Text } from "@chakra-ui/react";
import Announcement from "src/models/Announcement";
import { formatDateStringWithTime } from "src/models/utils/Date";

const MobileAnnouncementTile = ({
  announcement,
}: {
  announcement: Announcement;
}) => {
  return (
    <Flex
      borderRadius={"6px"}
      border={"1px solid #D6D6D6"}
      w="full"
      gap={1}
      p={2}
      direction={"column"}
    >
      <Heading color={"#ED7D31"} fontSize={"md"}>
        {announcement.title}
      </Heading>

      <Text fontSize={"2xs"}>
        {formatDateStringWithTime(announcement.createdAt)}
      </Text>
      <Text fontSize={"sm"}>{announcement.body}</Text>
    </Flex>
  );
};

export default MobileAnnouncementTile;
