import React, { useState, useEffect, useContext } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { Conversion } from "models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";

type Props = {};

const ConversionHistoryWidget = (props: Props) => {
  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const [conversions, setConversions] = useState<Conversion[]>([]);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchConversions = async () => {
      if (!currentUser) return;

      const conversions = await conversionService.query({
        userId: currentUser.uid,
      });
      setConversions(conversions);
    };

    fetchConversions();
  }, [conversionService, currentUser]);

  return (
    <Flex
      p={26}
      borderRadius="20px"
      width="95%"
      gap={2}
      flexDirection="column"
      boxShadow="3px 4px 12px rgba(0, 0, 0, 0.2)"
    >
      <Flex w="100%" alignItems={"center"}>
        <Heading as="h1" fontSize="1.2em" fontWeight={700}>
          Conversion History
        </Heading>
      </Flex>
    </Flex>
  );
};

export default ConversionHistoryWidget;
