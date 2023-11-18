import {
  Button,
  IconButton,
  Heading,
  Switch,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Select,
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
import { FaDollarSign, FaPlus, FaTrash } from "react-icons/fa";
import { ClientService } from "services/interfaces/ClientService";
import { DependencyInjection } from "utils/DependencyInjection";
import { Client } from "models/Client";
import useSuccessNotification from "components/utils/SuccessNotification";
import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "models/enums/ReferralLinkType";
import { AffiliateDeal } from "models/AffiliateDeal";
import { ImageService } from "services/interfaces/ImageService";

type Props = {
  existingClient?: Client | null;
  exit: () => void;
};

const ClientSettingsEditor = ({ existingClient, exit }: Props) => {
  const clientService: ClientService = DependencyInjection.clientService();

  const editMode = existingClient !== null;

  const [clientLogo, setClientLogo] = useState<File | null>(null);
  const [clientLogoUrl, setClientLogoUrl] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>(existingClient?.id ?? "");
  const [displayName, setDisplayName] = useState<string>(
    existingClient?.name ?? ""
  );

  const [errorText, setErrorText] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(existingClient?.enabled ?? true);

  const blankDeal = (): {
    type: ReferralLinkType | null;
    enabled: boolean;
    link: string;
    cpa: number | undefined;
    targetBetSize: number | undefined;
    targetMonthlyConversions: number | undefined;
  } => ({
    type: null,
    enabled: true,
    link: "",
    cpa: undefined,
    targetBetSize: undefined,
    targetMonthlyConversions: undefined,
  });

  const [affiliateDeals, setAffiliateDeals] = useState<
    Partial<AffiliateDeal>[]
  >(existingClient?.affiliateDeals ?? [blankDeal()]);

  useEffect(() => {
    const fetchLogo = async () => {
      if (existingClient) {
        const logoUrl = await clientService.getLogoUrl(existingClient.id);
        setClientLogoUrl(logoUrl);
      }
    };
    fetchLogo();
  }, [clientService, existingClient]);

  const setDealProperty = (
    index: number,
    modify: (deal: Partial<AffiliateDeal>) => Partial<AffiliateDeal>
  ) => {
    const newDeals = [...affiliateDeals];
    newDeals[index] = modify(newDeals[index]);
    setAffiliateDeals(newDeals);
  };

  const addNewDeal = () => {
    setAffiliateDeals([...affiliateDeals, blankDeal()]);
  };

  const removeDeal = (index: number) => {
    const newDeals = [...affiliateDeals];
    newDeals.splice(index, 1);
    setAffiliateDeals(newDeals);
  };

  const triggerAttachmentsUpload = () => {
    const fileInput = document.getElementById("attachments-upload");
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const handleAttachementsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setClientLogo(Array.from(event.target.files)[0]);
    } else {
      setClientLogo(null);
    }
  };

  const showSuccess = useSuccessNotification();

  const validateClient = (): boolean => {
    if (!clientId.trim() || clientId.includes(" ")) {
      setErrorText("Client ID is invalid.");
      return false;
    }
    if (!displayName.trim()) {
      setErrorText("Display Name is required");
      return false;
    }
    if (!clientLogo && !editMode) {
      setErrorText("Client Logo is required");
      return false;
    }
    return true;
  };

  const saveOrCreateNew = async () => {
    if (!validateClient()) {
      return;
    }

    const deals: AffiliateDeal[] = affiliateDeals
      .map((deal) =>
        AffiliateDeal.fromPartial(deal, {
          clientId: clientId,
          clientName: displayName,
        })
      )
      .filter((deal) => deal !== null) as AffiliateDeal[];

    let client: Client = new Client({
      id: clientId,
      name: displayName,
      affiliateDeals: deals,
      enabled: enabled,
      updatedAt: new Date(),
      createdAt: editMode ? existingClient?.createdAt : new Date(),
    });
    let result;
    let imageResult;
    if (editMode) {
      result = await clientService.update(client);
    } else {
      result = await clientService.create(client);
    }
    if (clientLogo) {
      imageResult = await clientService.uploadLogo(client.id, clientLogo);
    }
    if (result && imageResult) {
      console.log("Upserted client", result);
      showSuccess({ message: "Client saved successfully" });
    } else {
      setErrorText("Error saving client");
    }

    exit();
  };

  const referralLinkTypes: (ReferralLinkType | null)[] = [
    null,
    ReferralLinkType.sports,
    ReferralLinkType.casino,
  ];

  return (
    <Flex direction={"column"} w="100%">
      <Flex justifyContent={"start"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          {editMode ? "Edit Client" : "Create New Client"}
        </Heading>
        <Spacer />
        <IconButton aria-label="Close" icon={<CloseIcon />} onClick={exit} />
      </Flex>
      <Flex w="100%" alignItems={"start"}>
        <Flex width={"50%"} flexDirection={"column"}>
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
              Sportsbook ID
            </Text>
            <Box h={1}></Box>
            <InputGroup>
              <Input
                focusBorderColor="#ED7D31"
                variant={"outline"}
                placeholder="Sportsbook ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </InputGroup>
          </React.Fragment>
          <Box h={4}></Box>

          <React.Fragment>
            <Text color="gray" fontSize="0.8em">
              Display Name
            </Text>
            <Box h={1}></Box>
            <InputGroup>
              <Input
                focusBorderColor="#ED7D31"
                variant={"outline"}
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </InputGroup>
          </React.Fragment>

          <Box h={6}></Box>

          {clientLogo === null ? (
            <InputGroup w="100%">
              <Button size="md" w="100%" onClick={triggerAttachmentsUpload}>
                <Input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAttachementsChange}
                  id="attachments-upload"
                />
                Upload Logo
              </Button>
            </InputGroup>
          ) : (
            <Button
              onClick={(_) => setClientLogo(null)}
              leftIcon={<FaTrash />}
              w="100%"
              colorScheme="red"
            >
              Remove Logo
            </Button>
          )}
        </Flex>
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          direction={"column"}
          h={"12em"}
          w="50%"
        >
          {clientLogo ? (
            <Image
              m={8}
              maxH="12em"
              maxW="45%"
              alt="asdf"
              src={URL.createObjectURL(clientLogo)}
            />
          ) : clientLogoUrl ? (
            <Image
              m={8}
              maxH="12em"
              maxW="45%"
              alt="asdf"
              src={clientLogoUrl}
            />
          ) : null}
        </Flex>
      </Flex>

      <Box h={4}></Box>
      <Flex w="100%" alignItems={"center"}>
        <Text fontSize={"1.2em"} fontWeight={700}>
          Affiliate Deals
        </Text>
        <Spacer />
        <Button leftIcon={<FaPlus />} size="sm" onClick={addNewDeal}>
          Add New Deal
        </Button>
      </Flex>

      <Box h={4}></Box>
      <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
        <Thead>
          <Tr>
            <Th textAlign="center">Enabled</Th>
            <Th textAlign="center">Link Type</Th>
            <Th textAlign="center">Link</Th>
            <Th textAlign="center">CPA</Th>
            <Th textAlign="center">Target Avg. Bet</Th>
            <Th textAlign="center">Target Monthly Conv.</Th>
          </Tr>
        </Thead>
        <Tbody>
          {affiliateDeals.map((deal, index) => (
            <Tr key={index}>
              <Td textAlign="center">
                <Switch
                  isChecked={affiliateDeals[index].enabled}
                  onChange={(e) => {
                    setDealProperty(index, (deal) => ({
                      ...deal,
                      enabled: e.target.checked,
                    }));
                  }}
                ></Switch>
              </Td>
              <Td textAlign={"center"}>
                <Select
                  size="sm"
                  value={deal.type ?? undefined}
                  onChange={(e) => {
                    const newLinkType = e.target.value as
                      | ReferralLinkType
                      | undefined;
                    setDealProperty(index, (deal) => ({
                      ...deal,
                      linkType: newLinkType ?? null,
                    }));
                  }}
                >
                  {referralLinkTypes.map((linkType) => (
                    <option key={linkType} value={linkType ?? undefined}>
                      {getReferralLinkTypeLabel(linkType)}
                    </option>
                  ))}
                </Select>
              </Td>

              <Td textAlign={"center"}>
                <Input
                  size={"sm"}
                  isDisabled={!affiliateDeals[index].enabled ?? true}
                  placeholder="Link"
                  value={affiliateDeals[index].link ?? ""}
                  onChange={(e) => {
                    setDealProperty(index, (deal) => ({
                      ...deal,
                      link: e.target.value,
                    }));
                  }}
                />
              </Td>
              <Td textAlign={"center"}>
                <InputGroup width="8em" margin="auto">
                  <InputLeftElement>
                    <Icon as={FaDollarSign} color="gray" />
                  </InputLeftElement>
                  <Input
                    pl={8}
                    size={"sm"}
                    type="number"
                    isDisabled={!affiliateDeals[index].enabled ?? true}
                    placeholder="CPA"
                    value={affiliateDeals[index].cpa ?? ""}
                    onChange={(e) => {
                      const numericValue = Number(e.target.value);
                      setDealProperty(index, (deal) => ({
                        ...deal,
                        cpa: numericValue === 0 ? undefined : numericValue,
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
                    size={"sm"}
                    type="number"
                    isDisabled={!affiliateDeals[index].enabled ?? true}
                    placeholder="Avg. Bet Size"
                    value={affiliateDeals[index].targetBetSize ?? ""}
                    onChange={(e) => {
                      const numericValue = Number(e.target.value);
                      setDealProperty(index, (deal) => ({
                        ...deal,
                        targetBetSize:
                          numericValue === 0 ? undefined : numericValue,
                      }));
                    }}
                  />
                </InputGroup>
              </Td>
              <Td textAlign={"center"}>
                <Input
                  width="6em"
                  type="number"
                  size={"sm"}
                  isDisabled={!affiliateDeals[index].enabled ?? true}
                  placeholder="# Conv."
                  value={affiliateDeals[index].targetMonthlyConversions ?? ""}
                  onChange={(e) => {
                    const numericValue = Number(e.target.value);
                    setDealProperty(index, (deal) => ({
                      ...deal,
                      targetMonthlyConversions:
                        numericValue === 0 ? undefined : numericValue,
                    }));
                  }}
                />
              </Td>
              <Td textAlign={"center"}>
                <IconButton
                  aria-label="Close"
                  icon={<FaTrash />}
                  onClick={() => removeDeal(index)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Box h={6}></Box>

      <Button onClick={saveOrCreateNew} w="full" colorScheme="orange">
        {editMode ? "Save Changes" : "Create New Client"}
      </Button>
      {errorText && (
        <Text color="red" fontSize="sm">
          {errorText}
        </Text>
      )}
    </Flex>
  );
};

export default ClientSettingsEditor;
