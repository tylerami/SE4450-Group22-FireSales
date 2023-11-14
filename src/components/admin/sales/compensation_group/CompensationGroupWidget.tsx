import { Button, Heading, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { ClientService } from "services/interfaces/ClientService";
import { DependencyInjection } from "utils/DependencyInjection";
import CompensationGroupEditor from "./CompensationGroupEditor";
import { CompensationGroup } from "@models/CompensationGroup";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import CompensationGroupDetailsTile from "./CompensationGroupDetailsTile";

type Props = {};

const CompensationGroupWidget = (props: Props) => {
  const [createMode, setCreateMode] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<CompensationGroup | null>(
    null
  );

  const [compGroups, setCompGroups] = useState<CompensationGroup[]>([]);

  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  useEffect(() => {
    const fetchCompGroups = async () => {
      const compGroups = await compGroupService.getAll();
      setCompGroups(compGroups);
    };
    fetchCompGroups();
  }, [compGroupService]);

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
        <CompensationGroupEditor
          exisitingGroup={editingGroup}
          exit={() => {
            setCreateMode(false);
            setEditingGroup(null);
          }}
        />
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
            compGroups.map((compGroup: CompensationGroup) => (
              <CompensationGroupDetailsTile
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
