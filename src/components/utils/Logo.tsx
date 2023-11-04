import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { IoMdFlame } from "react-icons/io";

type Props = {
  size?: string;
};

const Logo = ({ size = "2em" }: Props) => {
  return (
    <Flex mt={10} alignItems={"center"}>
      <IoMdFlame color="red" size={size} />
      <Box w={10}></Box>
      <Heading fontWeight={700} fontSize={size} color="black" opacity={0.7}>
        FireSales
      </Heading>
    </Flex>
  );
};

export default Logo;
