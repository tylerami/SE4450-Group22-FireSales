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
import { Image, Box, Text, Flex } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ClientService } from "services/interfaces/ClientService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import { Client } from "src/models/Client";
import useSuccessNotification from "components/utils/SuccessNotification";
import { ReferralLinkType } from "src/models/enums/ReferralLinkType";
import { AffiliateDeal } from "src/models/AffiliateDeal";
import ClientAffiliateDealsTable from "./ClientAffiliateDealsTable";

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

  const [loading, setLoading] = useState<boolean>(false);

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

  const setDeal = (index: number, deal: Partial<AffiliateDeal>) => {
    const newDeals = [...affiliateDeals];
    newDeals[index] = deal;
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

    setLoading(true);

    const deals: AffiliateDeal[] = affiliateDeals
      .map((deal) =>
        AffiliateDeal.fromPartial(deal, {
          clientId: clientId,
          clientName: displayName,
        })
      )
      .filter((deal) => deal !== null) as AffiliateDeal[];

    let client: Client = new Client({
      timestamp: new Date(),
      id: clientId,
      name: displayName,
      affiliateDeals: deals,
      enabled: enabled,
    });
    const result = await clientService.set(client);
    console.log("Upserted client", result);
    if (clientLogo) {
      await clientService.uploadLogo(client.id, clientLogo);
    }
    if (result) {
      console.log("Upserted client", result);
      showSuccess({ message: "Client saved successfully" });
      exit();
    } else {
      setErrorText("Error saving client");
    }
    setLoading(false);
  };

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
                isReadOnly={editMode}
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

      <ClientAffiliateDealsTable
        affiliateDeals={affiliateDeals}
        setDeal={setDeal}
        removeDeal={removeDeal}
      />

      <Box h={6}></Box>

      <Button
        isLoading={loading}
        onClick={saveOrCreateNew}
        w="full"
        colorScheme="orange"
      >
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
