// I want to see:
// - my performance this week / month / year
// - my commission rate

// - area to upload new sales
// - my conversion history
import { Box, Flex, Heading, Text, useBreakpointValue } from "@chakra-ui/react";
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

const sportsbooks: string[] = ["pointsbet", "betano", "bet99"];

type Props = {};

const ReferralLinkWidget = (props: Props) => {
  const sportsbooksRows: string[][] = [];

  const absoluteMaxRows: number =
    useBreakpointValue({
      base: 2,
      md: 3,
      lg: 4,
      xl: 4,
      "2xl": 4,
    }) ?? 3;

  let maxCols =
    sportsbooks.length <= absoluteMaxRows
      ? sportsbooks.length
      : Math.min(Math.ceil(sportsbooks.length / 2), absoluteMaxRows);
  for (let i = 0; i < sportsbooks.length; i += maxCols) {
    const row = sportsbooks.slice(i, i + maxCols);
    sportsbooksRows.push(row);
  }

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

      {sportsbooksRows.map((sportsbooksRow, i) => (
        <Flex key={i} w="100%" gap={8} justifyContent={"space-evenly"}>
          {sportsbooksRow.map((sportsbook, j) => (
            <SportsbookLinkButton
              key={j}
              sportsbookId={sportsbook}
              link={"https://www.google.com"}
            />
          ))}
        </Flex>
      ))}
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
  const copyLabel = useBreakpointValue({
    base: "Copy",
    xl: "Copy to Clipboard",
  });

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
  };

  return (
    <Flex
      direction={{ base: "column", "2xl": "row" }}
      borderRadius={"12px"}
      p={6}
      gap={6}
      width={"full"}
      cursor={"pointer"}
      transition={"all 0.2s ease-in-out"}
      _hover={{ background: "#FFE6D7" }}
      border="1px solid #D2D2D2"
    >
      <ImageComponent
        maxHeight="5em"
        maxWidth="10em"
        imagePath={`/sportsbooks/logos/${sportsbookId}-logo-dark.png`}
      />
      <Flex
        direction={"column"}
        alignItems="center"
        gap={2}
        width="100%"
        maxWidth={{ base: "100%", "2xl": "60%" }}
        justifyContent={"space-evenly"}
      >
        {" "}
        {/* bet and commission requirements/info */}
        <Flex>
          <Text>Min. Bet: </Text>
          <Text mx={1} fontWeight={700}>
            $80
          </Text>
        </Flex>
        <Flex>
          <Text>Commission: </Text>
          <Text mx={1} fontWeight={700}>
            $50
          </Text>
        </Flex>
        {/* buttons */}
        <Button
          width={"full"}
          colorScheme="orange"
          onClick={() => window.open(link, "_blank")}
        >
          Sign Up Now
        </Button>
        <Button width={"full"} onClick={handleCopyToClipboard}>
          {isCopied ? "Copied!" : copyLabel}
        </Button>
      </Flex>
    </Flex>
  );
};

export default ReferralLinkWidget;
