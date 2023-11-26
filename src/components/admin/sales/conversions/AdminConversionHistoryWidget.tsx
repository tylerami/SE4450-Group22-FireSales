import React, { useState, useEffect, useContext } from "react";
import { Flex } from "@chakra-ui/react";
import { Conversion } from "models/Conversion";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";
import SelectedConversionContent from "./AdminSelectedConversionContent";
import AdminConversionBrowserContent from "./AdminConversionBrowserContent";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { CompensationGroup } from "models/CompensationGroup";
import { ClientService } from "services/interfaces/ClientService";
import { Client } from "models/Client";

type Props = {
  conversions: Conversion[];
  setConversionIsSelected: (isBooled: boolean) => void;
};

const AdminConversionHistoryWidget = ({
  conversions,
  setConversionIsSelected,
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

  const exit = () => {
    setSelectedConversion(null);
    setConversionIsSelected(false);
  };

  const selectConversion = (conversion: Conversion) => {
    setSelectedConversion(conversion);
    setConversionIsSelected(true);
  };

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
        <AdminConversionBrowserContent
          clients={clients}
          compGroup={compGroup}
          conversions={conversions}
          selectConversion={selectConversion}
        />
      )}
    </Flex>
  );
};

export default AdminConversionHistoryWidget;
