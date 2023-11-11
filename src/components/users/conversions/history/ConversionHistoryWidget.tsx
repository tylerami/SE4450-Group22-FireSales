import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Conversion } from "models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";
import { CloseIcon } from "@chakra-ui/icons";
import ImageComponent from "components/utils/ImageComponent";
import ConversionMessageWidget from "components/admin/sales/user_management/conversion_management/ConversionMessagesWidget";
import { formatDateString } from "utils/Date";
import { sampleConversions } from "__mocks__/models/Conversion.mock";

type Props = {};

const properties = [
  {
    label: "Conversion ID",
    function: (Conversion) => Conversion.id,
  },
  {
    label: "Date",
    function: (Conversion) => formatDateString(Conversion.date),
  },
  {
    label: "Sportsbook",
    function: (Conversion) => Conversion.clientId,
  },
  {
    label: "Bet size",
    function: (Conversion) => Conversion.amount,
  },
  {
    label: "Customer Name",
    function: (Conversion) => Conversion.customerId,
  },
  {
    label: "Commission",
    function: (Conversion) => Conversion.commission,
  },
];

const ConversionHistoryWidget = (props: Props) => {
  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [selectedConversion, setSelectedConversion] =
    useState<Conversion | null>(null);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchConversions = async () => {
      if (!currentUser) return;

      // const conversions = await conversionService.query({
      //   userId: currentUser.uid,
      // });
      const conversions = sampleConversions;
      setConversions(conversions);
    };

    fetchConversions();
  }, [conversionService, currentUser]);

  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      minWidth={"35em"}
      width={"100%"}
      gap={6}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Flex justifyContent={"space-between"}>
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          {selectedConversion
            ? selectedConversion.description()
            : "Conversion History"}
        </Heading>

        <Button cursor={"default"} _hover={{}} disabled>
          Not Verified
        </Button>

        {selectedConversion && (
          <IconButton
            onClick={() => {
              setSelectedConversion(null);
            }}
            icon={<CloseIcon />}
            aria-label={""}
          />
        )}
      </Flex>

      {selectedConversion && (
        <Flex
          maxH={"40em"}
          gap={10}
          justifyContent={"space-evenly"}
          alignItems={"center"}
          w="100%"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <ImageComponent
              imagePath={`/conversions/1/${selectedConversion.id}_${
                index + 1
              }.png`}
            />
          ))}
        </Flex>
      )}

      {selectedConversion && (
        <Flex gap={8}>
          <Button size="lg" colorScheme="green" w="full">
            Approve
          </Button>
          <Button size="lg" colorScheme="red" w="full">
            Deny
          </Button>
        </Flex>
      )}

      {selectedConversion && <ConversionMessageWidget />}

      {!selectedConversion && (
        <Table size="sm">
          <Thead>
            <Tr>
              {properties.map((property, i) => {
                return <Th textAlign={"center"}>{property.label}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {conversions.map((sale, i) => (
              <Tr
                cursor={"pointer"}
                onClick={() => {
                  setSelectedConversion(sale);
                }}
                _hover={{ background: "rgba(237, 125, 49, 0.26)" }}
              >
                {properties.map((property, i) => {
                  return (
                    <Td textAlign={"center"}>{property.function(sale)}</Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Flex>
  );
};

export default ConversionHistoryWidget;
