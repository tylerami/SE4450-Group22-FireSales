import { Button, Heading, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { DependencyInjection } from "models/utils/DependencyInjection";
import CompensationGroupEditor from "./CompensationGroupEditor";
import { CompensationGroup } from "models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import CompensationGroupDetailsTile from "./CompensationGroupDetailsTile";
import { UserService } from "services/interfaces/UserService";
import { ConversionService } from "services/interfaces/ConversionService";

type Props = {};

const CompensationGroupWidget = (props: Props) => {
  const [createMode, setCreateMode] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<CompensationGroup | null>(
    null
  );

  const [updateTrigger, setUpdateTrigger] = useState<number>(0);
  const [compGroups, setCompGroups] = useState<CompensationGroup[]>([]);

  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const userService: UserService = DependencyInjection.userService();

  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  useEffect(() => {
    const fetchCompGroups = async () => {
      const compGroups = await compGroupService.getAll();
      setCompGroups(compGroups);
    };

    fetchCompGroups();
  }, [compGroupService, conversionService, updateTrigger, userService]);

  const exit = () => {
    setCreateMode(false);
    setEditingGroup(null);
    setUpdateTrigger(updateTrigger + 1);
  };

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      width={"95%"}
      gap={4}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      {createMode || editingGroup ? (
        <CompensationGroupEditor exisitingGroup={editingGroup} exit={exit} />
      ) : (
        <React.Fragment>
          <Flex justifyContent={"start"}>
            <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
              Compensation Groups
            </Heading>{" "}
          </Flex>

          {!compGroups ? (
            <Spinner />
          ) : (
            compGroups.map((compGroup: CompensationGroup, i: number) => (
              <CompensationGroupDetailsTile
                key={i}
                compGroup={compGroup}
                selectCompGroup={setEditingGroup}
              />
            ))
          )}

          <Button
            colorScheme="blue"
            w="full"
            onClick={() => setCreateMode(true)}
          >
            Create New Group
          </Button>
        </React.Fragment>
      )}
    </Flex>
  );
};

export default CompensationGroupWidget;
