import { Flex, Heading, Text, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { Button } from "@chakra-ui/react";
import ImageComponent from "../../../utils/ImageComponent";
import { Client } from "@models/Client";
import { getReferralLinkTypeLabel } from "models/enums/ReferralLinkType";
import { AffiliateLink } from "models/AffiliateLink";
import { formatMoney } from "utils/Money";
import { ClientService } from "services/interfaces/ClientService";
import { DependencyInjection } from "utils/DependencyInjection";

const AffiliateLinksContainer = ({
  client,
  affiliateLinks,
}: {
  client: Client;
  affiliateLinks: AffiliateLink[];
}) => {
  const [logoSrc, setLogoSrc] = useState<string | undefined>(undefined);

  const clientService: ClientService = DependencyInjection.clientService();

  useEffect(() => {
    const fetchLogo = async () => {
      const logoUrl = await clientService.getLogoUrl(client.id);
      if (logoUrl) setLogoSrc(logoUrl);
    };

    fetchLogo();
  }, [client.id, clientService]);

  return (
    <Flex
      direction={{ base: "column" }}
      borderRadius={"12px"}
      p={4}
      pt={1}
      width={"full"}
      transition={"all 0.2s ease-in-out"}
      _hover={{ background: "#FFE6D7" }}
      border="1px solid #D2D2D2"
    >
      <ImageComponent
        maxHeight="5em"
        maxWidth="10em"
        minWidth="5em"
        imagePath={logoSrc}
      />
      <Flex gap={6} w="full">
        {affiliateLinks.map((affiliateLink, i) => (
          <ReferralLinkColumn affiliateLink={affiliateLink} key={i} />
        ))}
      </Flex>
    </Flex>
  );
};

const ReferralLinkColumn = ({
  affiliateLink,
}: {
  affiliateLink: AffiliateLink;
}) => {
  const copyLabel = useBreakpointValue({
    base: "Copy",
    xl: "Copy to Clipboard",
  });

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink.link);
    setIsCopied(true);
  };

  const fontSize = useBreakpointValue({
    base: "sm",
    xl: "md",
  });

  return (
    <Flex
      direction={"column"}
      alignItems="center"
      gap={2}
      width="100%"
      maxWidth={{ base: "100%" }}
      justifyContent={"space-evenly"}
    >
      {" "}
      <Heading size="sm">
        {getReferralLinkTypeLabel(affiliateLink.type)}
      </Heading>
      {/* bet and commission requirements/info */}
      <Flex>
        <Text fontSize={fontSize}>Min. Bet: </Text>
        <Text fontSize={fontSize} mx={1} fontWeight={700}>
          {formatMoney(affiliateLink.minBetSize)}
        </Text>
      </Flex>
      <Flex mt={-2}>
        <Text fontSize={fontSize}>Commission: </Text>
        <Text fontSize={fontSize} mx={1} fontWeight={700}>
          {formatMoney(affiliateLink.commission)}
        </Text>
      </Flex>
      {/* buttons */}
      <Button
        size="sm"
        width={"full"}
        colorScheme="orange"
        onClick={() => window.open(affiliateLink.link, "_blank")}
      >
        Sign Up Page
      </Button>
      <Button size="sm" width={"full"} onClick={handleCopyToClipboard}>
        {isCopied ? "Copied!" : copyLabel}
      </Button>
    </Flex>
  );
};

export default AffiliateLinksContainer;
