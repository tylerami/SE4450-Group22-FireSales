import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AdminRecordConversionsWidget from "./bulk/AdminRecordConversionsWidget";
import AdminManualRecordConversionsWidgetContent from "./manual/AdminManualRecordConversionsWidgetContent";
import {
  ADMIN_COMP_GROUP_ID,
  CompensationGroup,
} from "models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { DependencyInjection } from "models/utils/DependencyInjection";

type Props = {};

const AdminRecordConversionsPage = (props: Props) => {
  const [compGroup, setCompGroup] = useState<CompensationGroup | null>(null);

  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  useEffect(() => {
    const fetchCompGroup = async () => {
      const compGroup = await compGroupService.get(ADMIN_COMP_GROUP_ID);
      setCompGroup(compGroup);
    };

    fetchCompGroup();
  }, [compGroupService]);

  return (
    <Flex
      alignItems={"center"}
      direction={"column"}
      width={"100%"}
      py={2}
      pt={8}
    >
      <AdminRecordConversionsWidget />
      <Box h={10} />
      {compGroup && (
        <AdminManualRecordConversionsWidgetContent
          compensationGroup={compGroup}
        />
      )}
      <Box h={40} />
    </Flex>
  );
};

export default AdminRecordConversionsPage;
