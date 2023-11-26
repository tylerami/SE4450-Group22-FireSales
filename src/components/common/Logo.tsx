import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import React from "react";
import { IoMdFlame } from "react-icons/io";
import HotTakesFullLogo from "assets/hottakes_full_logo.png";

const USE_HOTTAKES_LOGO = true;

type Props = {
  size?: string;
};

const Logo = ({ size = "10em" }: Props) => {
  const sizeNumber = Number(size.slice(0, -2));

  if (USE_HOTTAKES_LOGO) {
    return (
      <React.Fragment>
        <Image height={size} src={HotTakesFullLogo} alt="hottakes" />
        <Box h={1} />
        <Text letterSpacing={6} fontWeight={200}>
          AFFILIATES
        </Text>
      </React.Fragment>
    );
  }

  return (
    <Flex alignItems={"center"}>
      <IoMdFlame color="red" size={size} />
      <Box w={sizeNumber * 0.8}></Box>
      <Heading fontWeight={700} fontSize={size} color="black" opacity={0.7}>
        FireSales
      </Heading>
    </Flex>
  );
};

export default Logo;
