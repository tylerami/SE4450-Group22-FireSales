import {
  Button,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Text,
} from "@chakra-ui/react";
import Announcement from "src/models/Announcement";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import React, { useEffect, useState } from "react";
import AnnouncementService from "services/interfaces/AnnouncementService";
import AnnouncementBuilder from "./AnnouncementBuilder";
import { CloseIcon } from "@chakra-ui/icons";
import AdminAnnouncementTile from "./AdminAnnouncementTile";

const AnnouncementsControlWidget = () => {
  const announcementService: AnnouncementService =
    DependencyInjection.announcementService();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [createMode, setCreateMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const announcements = await announcementService.getAll();
      setAnnouncements(announcements);
    };
    fetchAnnouncements();
  }, [announcementService]);

  const createAnnouncement = async (announcement: Announcement) => {
    await announcementService.create(announcement);
    setAnnouncements([...announcements, announcement]);
  };

  const deleteAnnouncement = async (announcement: Announcement) => {
    await announcementService.delete(announcement);
    setAnnouncements(announcements.filter((a) => a.id() !== announcement.id()));
  };

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      width={"95%"}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
      gap={4}
      minHeight={"10em"}
    >
      <Flex justifyContent={"start"} gap={4}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          {createMode ? "Create Announcement" : "Announcements"}
        </Heading>
        <Spacer />
        {createMode ? (
          <IconButton
            aria-label="Close"
            icon={<CloseIcon />}
            onClick={() => setCreateMode(false)}
          />
        ) : (
          <Button onClick={() => setCreateMode(true)} colorScheme="blue">
            Create New
          </Button>
        )}
      </Flex>

      {createMode ? (
        <AnnouncementBuilder
          createAnnouncement={createAnnouncement}
          exit={() => setCreateMode(false)}
        />
      ) : (
        <Flex direction={"column"} gap={4}>
          {announcements.length === 0 ? (
            <Text fontSize="md">No announcements published yet... </Text>
          ) : (
            announcements.map((announcement) => (
              <AdminAnnouncementTile
                delete={() => deleteAnnouncement(announcement)}
                key={announcement.id()}
                announcement={announcement}
              />
            ))
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default AnnouncementsControlWidget;
