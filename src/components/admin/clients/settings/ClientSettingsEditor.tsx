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
import React, { useState } from "react";
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
import { Client } from "models/Client";
import useSuccessNotification from "components/utils/SuccessNotification";
import {
  ReferralLinkType,
  getReferralLinkTypeLabel,
} from "models/enums/ReferralLinkType";
import { AffiliateDeal } from "models/AffiliateDeal";

type Props = {
  existingClient?: Client | null;
  exit: () => void;
};

const ClientSettingsEditor = ({ existingClient, exit }: Props) => {
  const editMode = existingClient !== null;

  const [sportsbookLogo, setSportsbookLogo] = useState<File | null>(null);
  const [sportsbookId, setSportsbookId] = useState<string>(
    existingClient?.id ?? ""
  );
  const [displayName, setDisplayName] = useState<string>(
    existingClient?.name ?? ""
  );

  const [enabled, setEnabled] = useState(existingClient?.enabled ?? true);

  const blankDeal = (): {
    enabled: boolean;
    link: string;
    cpa: number | undefined;
    targetBetSize: number | undefined;
    targetMonthlyConversions: number | undefined;
  } => ({
    enabled: true,
    link: "",
    cpa: undefined,
    targetBetSize: undefined,
    targetMonthlyConversions: undefined,
  });

  const [affiliateDeals, setAffiliateDeals] = useState<
    Partial<AffiliateDeal>[]
  >(existingClient?.affiliateDeals ?? [blankDeal()]);

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
      setSportsbookLogo(Array.from(event.target.files)[0]);
    } else {
      setSportsbookLogo(null);
    }
  };

  const clientService: ClientService = DependencyInjection.clientService();

  const showSuccess = useSuccessNotification();

  const saveOrCreateNew = async () => {
    let client: Client = new Client({
      id: sportsbookId,
      name: displayName,
      affiliateDeals: [],
      enabled: enabled,
      updatedAt: new Date(),
      createdAt: editMode ? existingClient?.createdAt : new Date(),
    });
    let result;
    if (editMode) {
      result = await clientService.update(client);
    } else {
      result = await clientService.create(client);
    }
    if (result) {
      console.log("Upserted client", result);
      showSuccess({ message: "Client saved successfully" });
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
                value={sportsbookId}
                onChange={(e) => setSportsbookId(e.target.value)}
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

          {sportsbookLogo === null ? (
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
              onClick={(_) => setSportsbookLogo(null)}
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
          {sportsbookLogo && (
            <Image
              m={8}
              maxH="12em"
              maxW="45%"
              alt="asdf"
              src={URL.createObjectURL(sportsbookLogo)}
            />
          )}
        </Flex>
      </Flex>

      <Box h={4}></Box>
      <Text fontSize={"1.2em"} fontWeight={700}>
        Affiliate Deals
      </Text>
      <Box h={4}></Box>
      <Table size="sm" variant="simple" alignSelf={"center"} width={"100%"}>
        <Thead>
          <Tr>
            <Th textAlign="center">Link Type</Th>
            <Th textAlign="center">Enabled</Th>
            <Th textAlign="center">Link</Th>
            <Th textAlign="center">CPA</Th>
            <Th textAlign="center">Target Avg. Bet Size</Th>
            <Th textAlign="center">Target Monthly Conv.</Th>
          </Tr>
        </Thead>
        <Tbody>
          {affiliateDeals.map((deal, index) => (
            <Tr key={index}>
              <Td maxW={"5em"} textAlign={"center"}>
                <Select
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
                  {[null, ...referralLinkTypes].map((linkType) => (
                    <option key={linkType} value={linkType ?? undefined}>
                      {getReferralLinkTypeLabel(linkType)}
                    </option>
                  ))}
                </Select>
              </Td>
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
                <Input
                  isDisabled={!affiliateDeals[index].enabled}
                  placeholder="Link"
                  value={affiliateDeals[index].link}
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
                    type="number"
                    isDisabled={!affiliateDeals[index].enabled}
                    placeholder="CPA"
                    value={affiliateDeals[index].cpa}
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
                    type="number"
                    isDisabled={!affiliateDeals[index].enabled}
                    placeholder="Avg. Bet Size"
                    value={affiliateDeals[index].targetBetSize}
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
                  isDisabled={!affiliateDeals[index].enabled}
                  placeholder="Monthly Conv."
                  value={affiliateDeals[index].targetMonthlyConversions}
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
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Box h={6}></Box>

      <Button onClick={saveOrCreateNew} w="full" colorScheme="orange">
        {editMode ? "Save Changes" : "Create New Client"}
      </Button>
    </Flex>
  );
};

export default ClientSettingsEditor;
