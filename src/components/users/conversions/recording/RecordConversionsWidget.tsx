import React, { useState, useContext, useEffect } from "react";
import { Heading, Spacer, Spinner, Switch, Text } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import ManualRecordConversionsWidgetContent from "./manual/ManualRecordConversionsWidgetContent";
import BulkRecordConversionsWidgetContent from "./bulk/BulkRecordConversionsWidgetContent";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { DependencyInjection } from "utils/DependencyInjection";
import { CompensationGroup } from "models/CompensationGroup";
import { UserContext } from "components/auth/UserProvider";

const ENABLE_BULK_MODE = false;

type Props = {};

enum RecordMode {
  manual,
  bulk,
}

const RecordConversionsWidget = (props: Props) => {
  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const [recordMode, setRecordMode] = useState<RecordMode>(RecordMode.manual);
  const [compensationGroup, setCompensationGroup] =
    useState<CompensationGroup | null>(null);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchCompensationGroup = async () => {
      const compGroupId = currentUser?.compensationGroupId;
      if (!compGroupId) {
        return;
      }
      const compGroup = await compGroupService.get(compGroupId);
      setCompensationGroup(compGroup);
    };

    fetchCompensationGroup();
  }, [compGroupService, currentUser?.compensationGroupId]);

  function handleSwitchChange() {
    if (recordMode === RecordMode.manual) {
      setRecordMode(RecordMode.bulk);
    } else {
      setRecordMode(RecordMode.manual);
    }
  }

  return (
    <Flex
      p={26}
      borderRadius="20px"
      width="100%"
      gap={2}
      flexDirection="column"
      boxShadow="3px 4px 12px rgba(0, 0, 0, 0.2)"
    >
      <Flex w="100%" alignItems={"center"}>
        <Heading as="h1" fontSize="1.2em" fontWeight={700}>
          {recordMode === RecordMode.bulk && "Bulk"} Record Conversions
        </Heading>
        <Spacer />

        {ENABLE_BULK_MODE && (
          <React.Fragment>
            <Text>Manual mode</Text>
            <Switch onChange={handleSwitchChange} mx={4} />
            <Text>Bulk mode</Text>{" "}
          </React.Fragment>
        )}
      </Flex>

      {compensationGroup ? (
        recordMode === RecordMode.manual ? (
          <ManualRecordConversionsWidgetContent
            compensationGroup={compensationGroup}
          />
        ) : (
          <BulkRecordConversionsWidgetContent
            compensationGroup={compensationGroup}
          />
        )
      ) : (
        <Flex w="100%" h="10em" justifyContent={"center"} alignItems={"center"}>
          <Spinner size="lg" />
        </Flex>
      )}
    </Flex>
  );
};

export default RecordConversionsWidget;
