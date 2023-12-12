import React, { useContext, useEffect, useState, useMemo } from "react";
import { Flex, Heading, Spinner, Alert } from "@chakra-ui/react";
import { UserContext } from "components/auth/UserProvider";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { Client } from "models/Client";
import { CompensationGroup } from "models/CompensationGroup";
import { AffiliateLink } from "models/AffiliateLink";
import MobileAffiliateLinksContainer from "./MobileAffiliateLinksContainer";

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

        let clients = await clientService.getAll();

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

const MobileAffiliateLinkWidget = () => {
  const { currentUser } = useContext(UserContext);

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

  type ClientLinkGroup = { client: Client; affiliateLinks: AffiliateLink[] };

  const clientLinkGroups: ClientLinkGroup[] = useMemo(() => {
    if (!clients || !compensationGroup) return [];

    const filteredClients = clients.filter(
      (client) =>
        client.enabled &&
        compensationGroup.affiliateLinks.filter(
          (link) => link.clientId === client.id
        ).length > 0
    );

    return filteredClients.map((client) => ({
      client,
      affiliateLinks: compensationGroup.affiliateLinks.filter(
        (link) => link.clientId === client.id
      ),
    }));
  }, [clients, compensationGroup]);

  if (isLoading) {
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
      {clientLinkGroups ? (
        <React.Fragment>
          <Flex gap={8} w="100%" alignItems={"center"}>
            <Heading as="h1" fontSize="1.2em" fontWeight={700}>
              My Referral Links:
            </Heading>
          </Flex>
          <Flex
            w="100%"
            direction={"column"}
            gap={4}
            justifyContent="space-evenly"
          >
            {clientLinkGroups.map((group, j) => (
              <MobileAffiliateLinksContainer
                client={group.client}
                affiliateLinks={group.affiliateLinks}
                key={j}
              />
            ))}
          </Flex>{" "}
        </React.Fragment>
      ) : (
        <Heading size="sm">
          You're account have not been activated yet. Check back in 1-2 business
          days!
        </Heading>
      )}
    </Flex>
  );
};

export default MobileAffiliateLinkWidget;
