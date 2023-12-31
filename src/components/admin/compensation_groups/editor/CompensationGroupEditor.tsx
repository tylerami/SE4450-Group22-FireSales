import {
  Button,
  IconButton,
  Heading,
  Switch,
  Input,
  InputGroup,
  Spacer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { ClientService } from "services/interfaces/ClientService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { Client, getAllAffiliateDeals } from "models/Client";
import useSuccessNotification from "components/utils/SuccessNotification";
import { ReferralLinkType } from "models/enums/ReferralLinkType";
import { CompensationGroup } from "models/CompensationGroup";
import { AffiliateLink } from "models/AffiliateLink";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { AffiliateDeal } from "models/AffiliateDeal";
import CompGroupEditorAffiliateLinksTable from "./CompGroupEditorAffiliateLinksTable";
import CompGroupEditorRetentionBonusesTable from "./CompGroupEditorRetentionBonusesTable";
import RetentionIncentive from "models/RetentionIncentive";

type Props = {
  exisitingGroup?: CompensationGroup | null;
  exit: () => void;
};

const CompensationGroupEditor = ({ exisitingGroup, exit }: Props) => {
  const clientService: ClientService = DependencyInjection.clientService();
  const compGroupService: CompensationGroupService =
    DependencyInjection.compensationGroupService();

  const [groupId, setGroupId] = useState<string>(exisitingGroup?.id ?? "");

  const [enabled, setEnabled] = useState(exisitingGroup?.enabled ?? true);

  const [clients, setClients] = useState<Client[]>([]);

  const [affiliateLinks, setAffiliateLinks] = useState<
    Partial<AffiliateLink>[]
  >([]);

  const initialIncentivesByClientId = (): Record<
    string,
    RetentionIncentive
  > => {
    const incentives: Record<string, RetentionIncentive> = {};
    for (const incentive of exisitingGroup?.retentionIncentives ?? []) {
      incentives[incentive.clientId] = incentive;
    }
    return incentives;
  };

  const [retentonIncentivesByClientId, setRetentionIncentivesByClientId] =
    useState<Record<string, RetentionIncentive>>(initialIncentivesByClientId());

  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    const initialLink = (
      deal: AffiliateDeal,
      existingLinks: AffiliateLink[]
    ): Partial<AffiliateLink> => {
      const existingLinkIndex: number | undefined = existingLinks.findIndex(
        (link) => link.type === deal.type && link.clientId === deal.clientId
      );

      let existingLink: AffiliateLink | undefined;
      if (existingLinkIndex !== undefined && existingLinkIndex !== -1) {
        existingLink = existingLinks[existingLinkIndex];
      }

      return {
        clientId: deal.clientId,
        clientName: deal.clientName,
        type: deal.type,
        enabled: existingLink?.enabled ?? false,
        minBetSize: existingLink?.minBetSize ?? undefined,
        commission: existingLink?.commission ?? undefined,
      };
    };

    const fetchClients = async () => {
      let clients = await clientService.getAll();
      clients = clients.filter(
        (client) => client.enabled && client.affiliateDeals.length > 0
      );
      setClients(clients);

      const affiliateDeals: AffiliateDeal[] = getAllAffiliateDeals(clients);

      affiliateDeals.sort((a, b) => b.cpa - a.cpa);
      affiliateDeals.sort((a, b) => a.clientName.localeCompare(b.clientName));

      let existingLinks: AffiliateLink[] = Object.assign(
        exisitingGroup?.affiliateLinks ?? [],
        []
      );

      const editableLinks: Partial<AffiliateLink>[] = affiliateDeals.map(
        (deal) => initialLink(deal, existingLinks)
      );

      setAffiliateLinks(editableLinks);
    };

    fetchClients();
  }, [clientService, exisitingGroup]);

  const editMode = exisitingGroup !== null;

  const showSuccess = useSuccessNotification();

  const affiliateLinkFromPartial = (link: Partial<AffiliateLink>) => {
    const client: Client | undefined = clients.find(
      (client) => client.id === link.clientId
    );
    if (!client) {
      throw new Error("Client not found");
    }

    const type: ReferralLinkType | null = link.type ?? null;

    const deal: AffiliateDeal | undefined = client?.getDealsByType(type)[0];
    if (!deal) {
      throw new Error("Deal not found");
    }

    if (link.minBetSize === undefined) {
      throw new Error("Min bet size is required");
    }

    if (link.commission === undefined) {
      throw new Error("Commission is required");
    }

    return new AffiliateLink({
      enabled: link.enabled!,
      minBetSize: link.minBetSize!,
      commission: link.commission!,
      clientId: deal.clientId,
      clientName: deal.clientName,
      type: deal.type,
      link: deal.link,
      cpa: deal.cpa,
    });
  };

  const saveOrCreateNew = async () => {
    try {
      const enabledLinks: AffiliateLink[] = affiliateLinks
        .filter((link) => link.enabled ?? false)
        .map(affiliateLinkFromPartial);

      const linkExistsForClient = (clientId: string): boolean => {
        return (
          enabledLinks.findIndex((link) => link.clientId === clientId) !== -1
        );
      };

      const retentionIncentives: RetentionIncentive[] = Object.values(
        retentonIncentivesByClientId
      ).filter(
        (incentive) =>
          incentive.amount > 0 &&
          incentive.monthlyLimit > 0 &&
          linkExistsForClient(incentive.clientId)
      );

      const group: CompensationGroup = new CompensationGroup({
        id: groupId,
        enabled: enabled,
        affiliateLinks: enabledLinks,
        retentionIncentives: retentionIncentives,
      });
      let result = await compGroupService.set(group);

      if (result) {
        showSuccess({ message: "Compensation group saved successfully" });
        exit();
      }
    } catch (e: any) {
      setErrorText(e.message);
      return;
    }
  };

  const enabledLinkClients = clients.filter((client) => {
    return affiliateLinks.some(
      (link) => link.enabled && link.clientId === client.id
    );
  });

  return (
    <Flex direction={"column"} w="100%">
      <Flex justifyContent={"start"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          {editMode ? "Edit Group" : "Create New Group"}
        </Heading>
        <Spacer />
        <IconButton aria-label="Close" icon={<CloseIcon />} onClick={exit} />
      </Flex>
      <Flex w="100%" alignItems={"start"} direction={"column"}>
        <Flex alignItems={"center"}>
          <Switch
            isChecked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          ></Switch>
          <Box w={2}></Box>
          <Text fontSize="sm">Enabled</Text>
        </Flex>
        <Box h={4}></Box>
        <React.Fragment>
          <Text color="gray" fontSize="0.8em">
            Compensation Group ID
          </Text>
          <Box h={1}></Box>
          <InputGroup>
            <Input
              isReadOnly={editMode}
              focusBorderColor="#ED7D31"
              variant={"outline"}
              placeholder="Group ID"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            />
          </InputGroup>
        </React.Fragment>
      </Flex>
      <Box h={6}></Box>

      <Box h={4}></Box>
      <Text fontSize={"1.2em"} fontWeight={700}>
        Sportsbooks
      </Text>
      <Box h={4}></Box>

      <CompGroupEditorAffiliateLinksTable
        affiliateLinks={affiliateLinks}
        setAffiliateLinks={setAffiliateLinks}
      />

      <Box h={4}></Box>
      <Text fontSize={"1.2em"} fontWeight={700}>
        Retention Incentives
      </Text>
      <Box h={4}></Box>
      <CompGroupEditorRetentionBonusesTable
        clients={enabledLinkClients}
        retentionIncentivesByClientId={retentonIncentivesByClientId}
        setRetentionIncentivesByClientId={setRetentionIncentivesByClientId}
      />

      <Box h={6}></Box>

      <Button onClick={saveOrCreateNew} w="full" colorScheme="orange">
        {editMode ? "Save Changes" : "Create New Group"}
      </Button>
      {errorText && (
        <Text color="red" fontSize="sm">
          {errorText}
        </Text>
      )}
    </Flex>
  );
};

export default CompensationGroupEditor;
