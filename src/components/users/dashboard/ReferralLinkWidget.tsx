// I want to see:
// - my performance this week / month / year
// - my commission rate

// - area to upload new sales
// - my conversion history
import { Box, Flex, Heading } from "@chakra-ui/react";
import React, { useState } from "react";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import ImageComponent from "../../utils/ImageComponent";

const sportsbooks = ["pointsbet", "betano", "bet99"];

type Props = {};

const ReferralLinkWidget = (props: Props) => {
  return (
    <Flex
      p={26}
      borderRadius={"20px"}
      width={"95%"}
      gap={6}
      flexDirection={"column"}
      boxShadow={"3px 4px 12px rgba(0, 0, 0, 0.2)"}
    >
      <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
        My Referral Links:
      </Heading>

      <Flex w="100%" justifyContent={"space-evenly"}>
        {sportsbooks.map((sportsbook, i) => (
          <SportsbookLinkButton
            key={i}
            sportsbookId={sportsbook}
            link={"https://www.google.com"}
          />
        ))}
      </Flex>
    </Flex>
  );
};

const SportsbookLinkButton = ({
  sportsbookId,
  link,
}: {
  sportsbookId: string;
  link: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
  };

  return (
    <Flex
      direction={"column"}
      borderRadius={"12px"}
      p={4}
      gap={3}
      w="20em"
      cursor={"pointer"}
      transition={"all 0.2s ease-in-out"}
      _hover={{ background: "#FFE6D7" }}
      border="1px solid #D2D2D2"
    >
      <ImageComponent
        height="50%"
        width="10em"
        imagePath={`/sportsbooks/logos/${sportsbookId}-logo-dark.png`}
      />
      <Button
        size="lg"
        colorScheme="orange"
        onClick={() => window.open(link, "_blank")}
      >
        Sign Up Now
      </Button>

      <Button onClick={handleCopyToClipboard}>
        {isCopied ? "Copied!" : "Copy to clipboard"}
      </Button>
    </Flex>
  );
};

export default ReferralLinkWidget;
