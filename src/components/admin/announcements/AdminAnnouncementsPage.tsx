import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import AnnouncementsControlWidget from "./AnnouncementsControlWidget";

type Props = {};

const AdminAnnouncementsPage = (props: Props) => {
  return (
    <Flex
      alignItems={"center"}
      direction={"column"}
      width={"100%"}
      py={2}
      pt={8}
    >
      <AnnouncementsControlWidget />
      <Box h={40} />
    </Flex>
  );
};

export default AdminAnnouncementsPage;
