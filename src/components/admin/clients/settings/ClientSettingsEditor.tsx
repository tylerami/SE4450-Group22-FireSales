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
  const [sportsbookLogo, setSportsbookLogo] = useState<File | null>(null);
  const [sportsbookId, setSportsbookId] = useState<string>(
    existingClient?.id ?? ""
  );
  const [displayName, setDisplayName] = useState<string>(
    existingClient?.name ?? ""
  );

  const [averagePaymentDays, setAveragePaymentDays] = useState<string | null>(
    ""
  );

  const [enabled, setEnabled] = useState(existingClient?.enabled ?? true);

  const initialDeal = (linkType: ReferralLinkType): Partial<AffiliateDeal> => {
    const existingDeal: AffiliateDeal | undefined =
      existingClient?.affiliateDeals[linkType];

    return {
      type: linkType,
      link: existingDeal?.link ?? "",
      enabled: existingDeal?.enabled ?? false,
      cpa: existingDeal?.cpa ?? undefined,
      targetBetSize: existingDeal?.targetBetSize ?? undefined,
      targetMonthlyConversions:
        existingDeal?.targetMonthlyConversions ?? undefined,
    };
  };

  const [affiliateDeals, setAffiliateDeals] = useState<{
    [key in ReferralLinkType]: Partial<AffiliateDeal>;
  }>({
    [ReferralLinkType.sports]: initialDeal(ReferralLinkType.sports),
    [ReferralLinkType.casino]: initialDeal(ReferralLinkType.casino),
    [ReferralLinkType.casinoAndSports]: initialDeal(
      ReferralLinkType.casinoAndSports
    ),
  });

  const setDealProperty = (
    type: ReferralLinkType,
    modify: (deal: Partial<AffiliateDeal>) => Partial<AffiliateDeal>
  ) => {
    let newAffiliateDeals = Object.assign({}, affiliateDeals);
    newAffiliateDeals[type] = modify(newAffiliateDeals[type]);
    setAffiliateDeals(newAffiliateDeals);
  };

  const editMode = existingClient !== undefined;

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
      affiliateDeals: {},
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

  const referralLinkTypes: ReferralLinkType[] = [
    ReferralLinkType.sports,
    ReferralLinkType.casino,
    ReferralLinkType.casinoAndSports,
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
          {referralLinkTypes.map((linkType, index) => (
            <Tr key={index}>
              <Td maxW={"5em"} textAlign={"center"}>
                {getReferralLinkTypeLabel(linkType as ReferralLinkType)}
              </Td>
              <Td textAlign="center">
                <Switch
                  isChecked={affiliateDeals[linkType].enabled}
                  onChange={(e) =>
                    setDealProperty(linkType, (deal) => ({
                      ...deal,
                      enabled: e.target.checked,
                    }))
                  }
                ></Switch>
              </Td>
              <Td textAlign={"center"}>
                <Input
                  isDisabled={!affiliateDeals[linkType].enabled}
                  placeholder="Link"
                  value={affiliateDeals[linkType].link}
                  onChange={(e) => {
                    setDealProperty(linkType, (deal) => ({
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
                    isDisabled={!affiliateDeals[linkType].enabled}
                    type="number"
                    placeholder="CPA"
                    value={affiliateDeals[linkType].cpa}
                    onChange={(e) => {
                      const numericValue = Number(e.target.value);
                      setDealProperty(linkType, (deal) => ({
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
                    isDisabled={!affiliateDeals[linkType].enabled}
                    placeholder="Bet size"
                    value={affiliateDeals[linkType].targetBetSize}
                    onChange={(e) => {
                      const numericValue = Number(e.target.value);
                      setDealProperty(linkType, (deal) => ({
                        ...deal,
                        betSize: numericValue === 0 ? undefined : numericValue,
                      }));
                    }}
                  />
                </InputGroup>
              </Td>
              <Td textAlign={"center"}>
                <Input
                  width="6em"
                  type="number"
                  isDisabled={!affiliateDeals[linkType].enabled}
                  placeholder="# Conv."
                  value={affiliateDeals[linkType].targetMonthlyConversions}
                  onChange={(e) => {
                    const numericValue = Number(e.target.value);
                    setDealProperty(linkType, (deal) => ({
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
