import { Button, Heading, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Client } from "models/Client";
import ClientSettingsEditor from "./ClientSettingsEditor";
import { ClientService } from "services/interfaces/ClientService";
import { DependencyInjection } from "utils/DependencyInjection";
import ClientDetailsTile from "./ClientDetailsTile";

type Props = {};

const ClientsSettingsWidget = (props: Props) => {
  const [createMode, setCreateMode] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [clients, setClients] = useState<Client[]>([]);

  const clientService: ClientService = DependencyInjection.clientService();

  useEffect(() => {
    const fetchClients = async () => {
      const clients = await clientService.getAll();
      setClients(clients);
    };

    fetchClients();
  }, [clientService]);

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
        <ClientSettingsEditor
          existingClient={editingClient}
          exit={() => {
            setCreateMode(false);
            setEditingClient(null);
          }}
        />
      ) : (
        <React.Fragment>
          <Flex justifyContent={"start"}>
            <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
              Client Settings
            </Heading>{" "}
          </Flex>

          {!clients ? (
            <Spinner />
          ) : (
            clients.map((client: Client) => (
              <ClientDetailsTile
                client={client}
                selectClient={setEditingClient}
              />
            ))
          )}

          <Button w="full" onClick={() => setCreateMode(true)}>
            Create New Client
          </Button>
        </React.Fragment>
      )}
    </Flex>
  );
};

export default ClientsSettingsWidget;
