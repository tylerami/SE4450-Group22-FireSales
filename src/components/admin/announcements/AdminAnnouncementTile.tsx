import { Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import Announcement from "models/Announcement";
import { formatDateStringWithTime } from "models/utils/Date";

const AdminAnnouncementTile = ({
  announcement,
  delete: deleteAnnouncement,
}: {
  announcement: Announcement;
  delete: () => void;
}) => {
  return (
    <Flex
      borderRadius={"20px"}
      border={"1px solid #D6D6D6"}
      w="full"
      gap={6}
      p={26}
      direction={"column"}
    >
      <Flex w="full" gap={4} alignItems={"center"}>
        <Heading color={"#ED7D31"} fontSize={"md"}>
          {announcement.title}
        </Heading>
        <Spacer />
        <Text fontSize={"sm"}>
          {formatDateStringWithTime(announcement.createdAt)}
        </Text>
        <Button onClick={deleteAnnouncement} colorScheme="red" size="sm" ml={2}>
          {" "}
          Delete{" "}
        </Button>
      </Flex>
      <Text>
        <strong>Compensation Groups: </strong>
        {Array.from(announcement.compensationGroupIds).join(", ")}
      </Text>

      <Text fontSize={"sm"}>{announcement.body}</Text>
    </Flex>
  );
};

export default AdminAnnouncementTile;
