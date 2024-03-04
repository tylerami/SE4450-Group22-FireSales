import React, { useState, useContext, useEffect, useMemo } from "react";
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
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import { CompensationGroup } from "src/models/CompensationGroup";
import { UserContext } from "components/auth/UserProvider";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Conversion } from "src/models/Conversion";

const ENABLE_BULK_MODE = false;

type Props = {
  minimizeRecordConversion: boolean;
  setMinimizeRecordConversions: (minimizeRecordConversion: boolean) => void;
  refresh: () => void;
  conversions: Conversion[];
};

enum RecordMode {
  manual,
  bulk,
}

const RecordConversionsWidget = ({
  conversions,
  minimizeRecordConversion,
  setMinimizeRecordConversions,
  refresh,
}: Props) => {
  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const [recordMode, setRecordMode] = useState<RecordMode>(RecordMode.manual);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [compGroupHistory, setCompGroupHistory] = useState<CompensationGroup[]>(
    []
  );

  const latestCompGroup: CompensationGroup | null = useMemo(
    () => (compGroupHistory.length > 0 ? compGroupHistory[0] : null),
    [compGroupHistory]
  );

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchCompGroupHistory = async () => {
      if (!currentUser) {
        return;
      }
      const compGroupHistory = await compGroupService.getHistory(currentUser);
      setCompGroupHistory(compGroupHistory);
      setIsLoading(false);
    };

    fetchCompGroupHistory();
  }, [compGroupService, currentUser]);

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
          {isLoading ? (
            <Flex
              w="100%"
              h="10em"
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Spinner size="lg" />
            </Flex>
          ) : recordMode === RecordMode.manual ? (
            <ManualRecordConversionsWidgetContent
              conversions={conversions}
              compGroupHistory={compGroupHistory}
              refresh={refresh}
            />
          ) : (
            <BulkRecordConversionsWidgetContent
              compensationGroup={latestCompGroup}
              refresh={refresh}
            />
          )}
        </React.Fragment>
      )}
    </Flex>
  );
};

export default RecordConversionsWidget;
