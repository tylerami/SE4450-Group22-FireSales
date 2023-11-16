import {
  Box,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";

import { ArrowUpIcon } from "@chakra-ui/icons";
import ConversionMessageTile from "./ConversionMessageTile";

const messages = [
  {
    fromSelf: true,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
  {
    fromSelf: false,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
  {
    fromSelf: true,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
  {
    fromSelf: false,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
  {
    fromSelf: true,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
  {
    fromSelf: false,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
  {
    fromSelf: true,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
  {
    fromSelf: false,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
  },
];

const ConversionMessageWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current?.scrollHeight);
  }, []);

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    // Prevent scrolling the parent container if:
    // 1. The content is not scrolled to the top and the user is scrolling up, or
    // 2. The content is not scrolled to the bottom and the user is scrolling down.
    if (
      (target.scrollTop > 0 && e.deltaY < 0) ||
      (target.scrollTop + target.offsetHeight < target.scrollHeight &&
        e.deltaY > 0)
    ) {
      e.stopPropagation();
    }
  };

  return (
    <Flex w="100%" direction={"column"}>
      <div
        ref={containerRef}
        style={{
          minHeight: "20em",
          maxHeight: "30em",
          borderRadius: "20px",
          border: "1px solid lightgray",
          padding: "6px",
          overflowY: "scroll",
        }}
        onWheel={handleScroll}
      >
        {messages.map((message, index) => (
          <Box my={4}>
            <ConversionMessageTile
              fromSelf={message.fromSelf}
              text={message.message}
              key={index}
            />
          </Box>
        ))}
        <InputGroup
          position={"sticky"}
          bottom={0}
          display={"flex"}
          alignItems={"center"}
        >
          <Textarea
            focusBorderColor="#ED7D31"
            placeholder="Send a message..."
            background={"white"}
          ></Textarea>
          <InputRightElement h="100%">
            <IconButton
              colorScheme="orange"
              mr={4}
              icon={<ArrowUpIcon />}
              aria-label={""}
            ></IconButton>
          </InputRightElement>
        </InputGroup>
      </div>
    </Flex>
  );
};

export default ConversionMessageWidget;
