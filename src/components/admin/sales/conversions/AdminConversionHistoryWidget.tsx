import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Conversion } from "models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";
import { CloseIcon } from "@chakra-ui/icons";
import ImageComponent from "components/utils/ImageComponent";
import ConversionMessageWidget from "components/common/conversions/ConversionMessagesWidget";
import { formatDateString } from "utils/Date";
import { sampleConversions } from "__mocks__/models/Conversion.mock";
import SelectedConversionContent from "./AdminSelectedConversionContent";
import AdminConversionBrowserContent from "./AdminConversionBrowserContent";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { CompensationGroup } from "@models/CompensationGroup";
import { ClientService } from "services/interfaces/ClientService";
import { Client } from "models/Client";

type Props = {
  conversions: Conversion[];
  togglePerformanceWidget: () => void;
};

const AdminConversionHistoryWidget = ({
  conversions,
  togglePerformanceWidget,
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
    togglePerformanceWidget();
  };

  const selectConversion = (conversion: Conversion) => {
    setSelectedConversion(conversion);
    togglePerformanceWidget();
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
