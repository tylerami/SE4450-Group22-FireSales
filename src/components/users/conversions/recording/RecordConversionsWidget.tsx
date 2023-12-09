import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Heading,
  Spacer,
  Spinner,
  Switch,
  Text,
} from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import ManualRecordConversionsWidgetContent from "./manual/ManualRecordConversionsWidgetContent";
import BulkRecordConversionsWidgetContent from "./bulk/BulkRecordConversionsWidgetContent";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { CompensationGroup } from "models/CompensationGroup";
import { UserContext } from "components/auth/UserProvider";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const ENABLE_BULK_MODE = false;

type Props = {
  minimizeRecordConversion: boolean;
  setMinimizeRecordConversions: (minimizeRecordConversion: boolean) => void;
  refresh: () => void;
};

enum RecordMode {
  manual,
  bulk,
}

const RecordConversionsWidget = ({
  minimizeRecordConversion,
  setMinimizeRecordConversions,
  refresh,
}: Props) => {
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

        {/* button to minimize / maximize the widget, with chevron icons  */}
        <Button
          width={"10em"}
          onClick={() =>
            setMinimizeRecordConversions(!minimizeRecordConversion)
          }
          leftIcon={
            minimizeRecordConversion ? <ChevronDownIcon /> : <ChevronUpIcon />
          }
        >
          {minimizeRecordConversion ? "Expand" : "Collapse"}
        </Button>
      </Flex>
      {!minimizeRecordConversion && (
        <React.Fragment>
          {compensationGroup ? (
            recordMode === RecordMode.manual ? (
              <ManualRecordConversionsWidgetContent
                compensationGroup={compensationGroup}
                refresh={refresh}
              />
            ) : (
              <BulkRecordConversionsWidgetContent
                compensationGroup={compensationGroup}
                refresh={refresh}
              />
            )
          ) : (
            <Flex
              w="100%"
              h="10em"
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Spinner size="lg" />
            </Flex>
          )}
        </React.Fragment>
      )}
    </Flex>
  );
};

export default RecordConversionsWidget;
