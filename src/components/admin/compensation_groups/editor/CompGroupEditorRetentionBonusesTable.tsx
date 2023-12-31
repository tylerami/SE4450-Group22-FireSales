import { Switch, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Icon } from "@chakra-ui/react";
import { FaDollarSign } from "react-icons/fa";
import { Client } from "models/Client";
import RetentionIncentive from "models/RetentionIncentive";

type Props = {
  clients: Client[];
  retentionIncentivesByClientId: Record<string, RetentionIncentive>;
  setRetentionIncentivesByClientId: (
    incentives: Record<string, RetentionIncentive>
  ) => void;
};

const CompGroupEditorRetentionBonusesTable = ({
  clients,
  retentionIncentivesByClientId,
  setRetentionIncentivesByClientId,
}: Props) => {
  const setClientRetentionIncentive = (
    clientId: string,
    incentive: RetentionIncentive | undefined
  ): void => {
    const newClientRetentionIncentives = { ...retentionIncentivesByClientId };
    if (incentive) {
      newClientRetentionIncentives[clientId] = incentive;
    } else {
      delete newClientRetentionIncentives[clientId];
    }
    setRetentionIncentivesByClientId(newClientRetentionIncentives);
  };

  const getClientRetentionIncentive = (
    clientId: string
  ): RetentionIncentive | undefined => {
    return retentionIncentivesByClientId[clientId];
  };

  const toggleClientRetentionIncentive = (clientId: string): void => {
    if (getClientRetentionIncentive(clientId)) {
      setClientRetentionIncentive(clientId, undefined);
    } else {
      setClientRetentionIncentive(
        clientId,
        new RetentionIncentive({
          clientId: clientId,
          amount: 0,
          monthlyLimit: 0,
        })
      );
    }
  };

  const isClientDisabled = (clientId: string): boolean => {
    return getClientRetentionIncentive(clientId) === undefined;
  };

  const getRetentionIncentiveAmount = (clientId: string): string => {
    const amount: number | undefined =
      getClientRetentionIncentive(clientId)?.amount;
    return amount ? amount.toString() : "";
  };

  const setRetentionIncentiveAmount = (clientId: string, amount: string) => {
    const numericValue = Number(amount);
    setClientRetentionIncentive(
      clientId,
      new RetentionIncentive({
        ...getClientRetentionIncentive(clientId)!,
        amount: numericValue,
      })
    );
  };

  const getRetentionIncentiveLimit = (clientId: string): string => {
    const amount: number | undefined =
      getClientRetentionIncentive(clientId)?.monthlyLimit;
    return amount ? amount.toString() : "";
  };

  const setRetentionIncentiveLimit = (clientId: string, limit: string) => {
    const numericValue = Number(limit);
    setClientRetentionIncentive(
      clientId,
      new RetentionIncentive({
        ...getClientRetentionIncentive(clientId)!,
        monthlyLimit: numericValue,
      })
    );
  };

  const columnHeaders: string[] = [
    "Sportsbook",
    "Enabled",
    "Deposit Amount",
    "Monthly Limit",
  ];

  return (
    <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
      <Thead>
        <Tr>
          {columnHeaders.map((header, index) => (
            <Th key={index} textAlign={"center"}>
              {header}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {clients.map((client, index) => (
          <Tr key={index}>
            <Td maxW={"5em"} textAlign={"center"}>
              {`${client.name}`}
            </Td>
            <Td textAlign="center">
              <Switch
                isChecked={getClientRetentionIncentive(client.id) !== undefined}
                onChange={() => toggleClientRetentionIncentive(client.id)}
              ></Switch>
            </Td>
            <Td textAlign={"center"}>
              <InputGroup width="8em" margin="auto">
                <InputLeftElement>
                  <Icon as={FaDollarSign} color="gray" />
                </InputLeftElement>
                <Input
                  pl={8}
                  type="number"
                  isDisabled={isClientDisabled(client.id)}
                  placeholder="Amount"
                  value={getRetentionIncentiveAmount(client.id)}
                  onChange={(e) =>
                    setRetentionIncentiveAmount(client.id, e.target.value)
                  }
                />
              </InputGroup>
            </Td>
            <Td textAlign={"center"}>
              <InputGroup width="8em" margin="auto">
                <InputLeftElement>
                  <Icon as={FaDollarSign} color="gray" />
                </InputLeftElement>
                <Input
                  pl={8}
                  type="number"
                  isDisabled={isClientDisabled(client.id)}
                  placeholder="Limit"
                  value={getRetentionIncentiveLimit(client.id)}
                  onChange={(e) =>
                    setRetentionIncentiveLimit(client.id, e.target.value)
                  }
                />
              </InputGroup>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default CompGroupEditorRetentionBonusesTable;
