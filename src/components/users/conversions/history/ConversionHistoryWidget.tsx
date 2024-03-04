import React, { useState, useEffect, useContext } from "react";
import { Flex } from "@chakra-ui/react";
import { Conversion } from "src/models/Conversion";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";
import SelectedConversionContent from "./SelectedConversionContent";
import ConversionBrowserContent from "./ConversionBrowserContent";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { CompensationGroup } from "src/models/CompensationGroup";
import { ClientService } from "services/interfaces/ClientService";
import { Client } from "src/models/Client";

type Props = {
  setIsConversionSelected: (isConversionSelected: boolean) => void;
  conversions: Conversion[];
  refresh: () => void;
};

const ConversionHistoryWidget = ({
  conversions,
  setIsConversionSelected,
  refresh,
}: Props) => {
  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const clientService: ClientService = DependencyInjection.clientService();

  const [selectedConversion, setSelectedConversion] =
    useState<Conversion | null>(null);
  const [compGroup, setCompGroup] = useState<CompensationGroup | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

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

    fetchCompGroup();
    fetchClients();
  }, [clientService, compGroupService, currentUser]);

  const selectConversion = (conversion: Conversion) => {
    setSelectedConversion(conversion);
    setIsConversionSelected(true);
  };

  const exit = () => {
    refresh();
    setSelectedConversion(null);
    setIsConversionSelected(false);
  };

  const relevantClientIds: Set<string> = new Set<string>(
    conversions.map((conversion) => conversion.affiliateLink.clientId)
  );

  const relevantClients: Client[] = clients.filter((client) =>
    relevantClientIds.has(client.id)
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
