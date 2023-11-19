import {
  Button,
  IconButton,
  Heading,
  Switch,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Box,
  Text,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { FaDollarSign, FaTrash } from "react-icons/fa";
import { ClientService } from "services/interfaces/ClientService";
import { DependencyInjection } from "utils/DependencyInjection";
import { Client, getAllAffiliateDeals } from "models/Client";
import useSuccessNotification from "components/utils/SuccessNotification";
import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "models/enums/ReferralLinkType";
import { CompensationGroup } from "models/CompensationGroup";
import { AffiliateLink } from "models/AffiliateLink";
import { CompensationGroupService } from "services/interfaces/CompensationGroupService";
import { AffiliateDeal } from "models/AffiliateDeal";
import { error } from "console";

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

  const setLinkProperty = (
    index: number,
    modify: (link: Partial<AffiliateLink>) => Partial<AffiliateLink>
  ) => {
    const newLinks = [...affiliateLinks];
    newLinks[index] = modify(newLinks[index]);
    setAffiliateLinks(newLinks);
  };

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

      const group: CompensationGroup = new CompensationGroup({
        id: groupId,
        enabled: enabled,
        affiliateLinks: enabledLinks,
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

  const columnHeaders: string[] = [
    "Sportsbook / Type",
    "Enabled",
    "Commission",
    "Min. Bet Size",
  ];

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
          {Object.values(affiliateLinks).map((link, index) => (
            <Tr key={index}>
              <Td maxW={"5em"} textAlign={"center"}>
                {`${link.clientName} / ${getReferralLinkTypeLabel(link.type!)}`}
              </Td>
              <Td textAlign="center">
                <Switch
                  isChecked={link.enabled}
                  onChange={(e) =>
                    setLinkProperty(index, (link) => ({
                      ...link,
                      enabled: e.target.checked,
                    }))
                  }
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
                    isDisabled={!link.enabled}
                    placeholder="Commission"
                    value={link.commission ?? ""}
                    onChange={(e) => {
                      const numericValue = Number(e.target.value);
                      setLinkProperty(index, (link) => ({
                        ...link,
                        commission:
                          numericValue === 0 ? undefined : numericValue,
                      }));
                    }}
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
                    isDisabled={!link.enabled}
                    placeholder="Min. bet size"
                    value={link.minBetSize ?? ""}
                    onChange={(e) => {
                      const numericValue = Number(e.target.value);
                      setLinkProperty(index, (link) => ({
                        ...link,
                        minBetSize:
                          numericValue === 0 ? undefined : numericValue,
                      }));
                    }}
                  />
                </InputGroup>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

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
