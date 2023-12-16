import React, { useContext, useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Text,
  IconButton,
  Spacer,
  Icon,
  Button,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Announcement from "models/Announcement";
import { FaExclamationCircle } from "react-icons/fa";
import AnnouncementService from "services/interfaces/AnnouncementService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";
import MobileAnnouncementTile from "./MobileAnnouncementTile";

const MobileAnnouncementsWidget = () => {
  const [pageIndex, setPageIndex] = useState(0);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const replaceAnnouncement = (announcement: Announcement) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id() === announcement.id() ? announcement : a))
    );
  };

  const announcementService: AnnouncementService =
    DependencyInjection.announcementService();

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const fetchedAnnouncements = await announcementService.getAll();
      setAnnouncements(fetchedAnnouncements ?? []);
    };
    fetchAnnouncements();
  }, [announcementService]);

  const nextPage = () => {
    if (pageIndex === announcements.length - 1) return;
    setPageIndex((prev) => prev + 1);
  };

  const prevPage = () => {
    if (pageIndex === 0) return;
    setPageIndex((prev) => prev - 1);
  };

  const markAsRead = async (announcement: Announcement) => {
    const uid = currentUser?.uid;
    if (!uid) return;

    await announcementService.markAsRead(announcement, uid);

    announcement.markAsRead(uid);
    replaceAnnouncement(announcement);
  };

  const currentAnnouncement: Announcement | null =
    announcements.length > 0 ? announcements[pageIndex] : null;
  const unread: boolean = !currentAnnouncement?.wasReadBy(currentUser) ?? false;

  return (
    currentAnnouncement && (
      <React.Fragment>
        {unread && (
          <Icon
            zIndex={3}
            position={"relative"}
            as={FaExclamationCircle}
            ml={"92%"}
            mb={"-2.5em"}
            w={6}
            h={6}
            color="red.500"
          />
        )}
        <Flex
          p={6}
          borderRadius="20px"
          width="95%"
          gap={4}
          overflowX={"hidden"}
          flexDirection="column"
          boxShadow="3px 4px 12px rgba(0, 0, 0, 0.2)"
        >
          <Flex gap={2} w="100%" alignItems={"center"}>
            <Heading fontSize={"md"}>Announcements</Heading>
            <Spacer />

            <React.Fragment>
              <IconButton
                size="xs"
                isDisabled={pageIndex === 0}
                onClick={prevPage}
                icon={<ChevronLeftIcon />}
                aria-label={""}
              />
              <Text fontSize={"xs"}>
                Page {pageIndex + 1} / {announcements.length}
              </Text>
              <IconButton
                size="xs"
                isDisabled={pageIndex === announcements.length - 1}
                onClick={nextPage}
                icon={<ChevronRightIcon />}
                aria-label={""}
              />
            </React.Fragment>
          </Flex>

          <MobileAnnouncementTile announcement={currentAnnouncement} />
          {unread && (
            <Button
              onClick={() => markAsRead(currentAnnouncement)}
              size="xs"
              colorScheme="blue"
            >
              Mark as read
            </Button>
          )}
        </Flex>
      </React.Fragment>
    )
  );
};

export default MobileAnnouncementsWidget;
