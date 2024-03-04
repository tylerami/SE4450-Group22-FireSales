import { Button, Heading, Spacer, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Client } from "src/models/Client";
import ClientSettingsEditor from "./ClientSettingsEditor";
import { ClientService } from "services/interfaces/ClientService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import ClientDetailsTile from "./ClientDetailsTile";

type Props = {};

const ClientsSettingsWidget = (props: Props) => {
  const [createMode, setCreateMode] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [triggerUpdate, setTriggerUpdate] = useState<number>(0);

  const [clients, setClients] = useState<Client[]>([]);

  const clientService: ClientService = DependencyInjection.clientService();

  useEffect(() => {
    const fetchClients = async () => {
      const clients = await clientService.getAll();
      clients.sort((a, b) => b.averageCpa() - a.averageCpa());
      // move enabled clients to the top
      clients.sort((a, b) => (a.enabled && !b.enabled ? -1 : 0));

      setClients(clients);
    };

    fetchClients();
  }, [clientService, triggerUpdate]);

  const exit = () => {
    setCreateMode(false);
    setEditingClient(null);
    setTriggerUpdate(triggerUpdate + 1);
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
      {createMode || editingClient ? (
        <ClientSettingsEditor existingClient={editingClient} exit={exit} />
      ) : (
        <React.Fragment>
          <Flex w="full" justifyContent={"start"}>
            <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
              Client Settings
            </Heading>{" "}
            <Spacer />
            <Button
              colorScheme="blue"
              onClick={() => setCreateMode(true)}
              size={"sm"}
            >
              Create New Client
            </Button>
          </Flex>

          {!clients ? (
            <Spinner />
          ) : (
            clients.map((client: Client, key: number) => (
              <ClientDetailsTile
                key={key}
                client={client}
                selectClient={setEditingClient}
              />
            ))
          )}

          <Button
            colorScheme="blue"
            w="full"
            onClick={() => setCreateMode(true)}
          >
            Create New Client
          </Button>
        </React.Fragment>
      )}
    </Flex>
  );
};

export default ClientsSettingsWidget;
