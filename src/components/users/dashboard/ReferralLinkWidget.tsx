import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
  Spinner,
  Alert,
  Icon,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import ClientLinksContainer from "./ClientLinksContainer";
import { UserContext } from "components/auth/UserProvider";
import { DependencyInjection } from "utils/DependencyInjection";
import { Client } from "@models/Client";
import { CompensationGroup } from "@models/CompensationGroup";
import { AffiliateLink } from "@models/AffiliateLink";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

// Custom hook for fetching data
const useFetchData = (currentUser) => {
  const [compensationGroup, setCompensationGroup] =
    useState<CompensationGroup | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const compGroupService = DependencyInjection.compensationGroupService();
        const clientService = DependencyInjection.clientService();

        if (currentUser?.compensationGroupId) {
          const compGroup = await compGroupService.get(
            currentUser.compensationGroupId
          );
          setCompensationGroup(compGroup);
        }

        const clients = await clientService.getAll();
        setClients(clients);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  return { compensationGroup, clients, isLoading, error };
};

const ReferralLinkWidget = () => {
  const { currentUser } = useContext(UserContext);
  const [pageIndex, setPageIndex] = useState(0);

  const nextPage = () => {
    if (pageIndex === clientLinkGroupRows.length - 1) return;
    setPageIndex((prev) => prev + 1);
  };

  const prevPage = () => {
    if (pageIndex === 0) return;
    setPageIndex((prev) => prev - 1);
  };

  const {
    compensationGroup,
    clients,
    isLoading,
    error,
  }: {
    compensationGroup: CompensationGroup | null;
    clients: Client[];
    isLoading: boolean;
    error: Error | null;
  } = useFetchData(currentUser);

  const absoluteMaxRowLength =
    useBreakpointValue({
      base: 1,
      md: 1,
      lg: 2,
      xl: 3,
      "2xl": 4,
    }) ?? 3;

  type ClientLinkGroup = { client: Client; affiliateLinks: AffiliateLink[] };

  const clientLinkGroups: ClientLinkGroup[] = useMemo(() => {
    if (!clients || !compensationGroup) return [];

    return clients.map((client) => ({
      client,
      affiliateLinks: compensationGroup.affiliateLinks.filter(
        (link) => link.clientId === client.id
      ),
    }));
  }, [clients, compensationGroup]);

  console.log(clientLinkGroups);
  console.log(clients);
  console.log(compensationGroup);
  const clientLinkGroupRows: ClientLinkGroup[][] = useMemo(() => {
    let rows: ClientLinkGroup[][] = [];
    let maxCols = clientLinkGroups.length;
    if (clientLinkGroups.length > absoluteMaxRowLength) {
      const largestRowLength = Math.ceil(clientLinkGroups.length / 2);
      maxCols = Math.min(largestRowLength, absoluteMaxRowLength);
    }

    for (let i = 0; i < clientLinkGroups.length; i += maxCols) {
      const row = clientLinkGroups.slice(i, i + maxCols);
      rows.push(row);
    }

    return rows;
  }, [clientLinkGroups, absoluteMaxRowLength]);

  const currentRow = clientLinkGroupRows[pageIndex];

  if (isLoading || !currentRow) {
    return <Spinner />;
  }

  if (error) {
    return <Alert status="error">Error loading data: {error.message}</Alert>;
  }

  return (
    <Flex
      p={26}
      borderRadius="20px"
      width="95%"
      gap={4}
      overflowX={"hidden"}
      flexDirection="column"
      boxShadow="3px 4px 12px rgba(0, 0, 0, 0.2)"
    >
      <Flex gap={8} w="100%" alignItems={"center"}>
        <Heading as="h1" fontSize="1.2em" fontWeight={700}>
          My Referral Links:
        </Heading>
        <Spacer />
        {clientLinkGroupRows.length > 1 && (
          <React.Fragment>
            <IconButton
              isDisabled={pageIndex === 0}
              onClick={prevPage}
              icon={<ChevronLeftIcon />}
              aria-label={""}
            />
            <Text>
              Page {pageIndex + 1} / {clientLinkGroupRows.length}
            </Text>
            <IconButton
              isDisabled={pageIndex === clientLinkGroupRows.length - 1}
              onClick={nextPage}
              icon={<ChevronRightIcon />}
              aria-label={""}
            />
          </React.Fragment>
        )}
      </Flex>

      <Flex w="100%" gap={8} justifyContent="space-evenly">
        {currentRow.map((group, j) => (
          <ClientLinksContainer
            client={group.client}
            affiliateLinks={group.affiliateLinks}
            key={j}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default ReferralLinkWidget;
