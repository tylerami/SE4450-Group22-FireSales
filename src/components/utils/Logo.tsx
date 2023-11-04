import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { IoMdFlame } from "react-icons/io";

type Props = {
  size?: string;
};

const Logo = ({ size = "2em" }: Props) => {
  const sizeNumber = Number(size.slice(0, -2));

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
