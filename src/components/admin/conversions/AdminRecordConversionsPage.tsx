import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AdminRecordConversionsWidget from "./bulk/AdminRecordConversionsWidget";
import {
  ADMIN_COMP_GROUP_ID,
  CompensationGroup,
} from "models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import AdminManualRecordConversionsWidgetContent from "./manual/AdminManualRecordConversionsWidgetContent";
import { ConversionService } from "services/interfaces/ConversionService";
import { Conversion } from "models/Conversion";

type Props = {};

const AdminRecordConversionsPage = (props: Props) => {
  const [compGroup, setCompGroup] = useState<CompensationGroup | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);

  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);
  const refresh = () => setUpdateTrigger(!updateTrigger);

  useEffect(() => {
    const fetchConversions = async () => {
      const conversions = await conversionService.query({});
      setConversions(conversions);
    };

    fetchConversions();
  }, [conversionService]);

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
        <Flex
          p={26}
          borderRadius="20px"
          width="95%"
          gap={2}
          flexDirection="column"
          boxShadow="3px 4px 12px rgba(0, 0, 0, 0.2)"
        >
          <AdminManualRecordConversionsWidgetContent
            conversions={conversions}
            compensationGroup={compGroup}
            refresh={refresh}
          />
        </Flex>
      )}
      <Box h={40} />
    </Flex>
  );
};

export default AdminRecordConversionsPage;
