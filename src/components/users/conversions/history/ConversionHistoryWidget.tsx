import React, { useState, useEffect, useContext } from "react";
import { Flex } from "@chakra-ui/react";
import { Conversion } from "models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";
import SelectedConversionContent from "./SelectedConversionContent";
import ConversionBrowserContent from "./ConversionBrowserContent";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { CompensationGroup } from "models/CompensationGroup";
import { ClientService } from "services/interfaces/ClientService";
import { Client } from "models/Client";

type Props = {
  setIsConversionSelected: (isConversionSelected: boolean) => void;
};

const ConversionHistoryWidget = ({ setIsConversionSelected }: Props) => {
  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const clientService: ClientService = DependencyInjection.clientService();

  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [selectedConversion, setSelectedConversion] =
    useState<Conversion | null>(null);
  const [compGroup, setCompGroup] = useState<CompensationGroup | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);
  const refresh = () => setUpdateTrigger(!updateTrigger);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchCompGroup = async () => {
      if (!currentUser || !currentUser.compensationGroupId) return;

      const compGroup = await compGroupService.get(
        currentUser.compensationGroupId
      );
      setCompGroup(compGroup);
    };

    const fetchClients = async () => {
      if (!currentUser) return;

      const clients: Client[] = await clientService.getAll();
      setClients(clients);
    };

    const fetchConversions = async () => {
      if (!currentUser) return;

      const conversions = await conversionService.query({
        userId: currentUser.uid,
      });
      setConversions(conversions);
    };

    fetchConversions();
    fetchCompGroup();
    fetchClients();
  }, [
    clientService,
    compGroupService,
    conversionService,
    currentUser,
    updateTrigger,
  ]);

  const selectConversion = (conversion: Conversion) => {
    setSelectedConversion(conversion);
    setIsConversionSelected(true);
  };

  const exit = () => {
    refresh();
    setSelectedConversion(null);
    setIsConversionSelected(false);
  };

  const relevantClients = clients.filter((client) =>
    compGroup?.clientIds().includes(client.id)
  );

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      minWidth={"35em"}
      width={"100%"}
      gap={6}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      {selectedConversion ? (
        <SelectedConversionContent
          exit={exit}
          selectedConversion={selectedConversion}
        />
      ) : (
        <ConversionBrowserContent
          clients={relevantClients}
          compGroup={compGroup}
          conversions={conversions}
          selectConversion={selectConversion}
        />
      )}
    </Flex>
  );
};

export default ConversionHistoryWidget;
