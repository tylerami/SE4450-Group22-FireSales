import {
  Box,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  Textarea,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";

import { ArrowUpIcon } from "@chakra-ui/icons";
import ConversionMessageTile from "./ConversionMessageTile";
import { Message } from "src/models/Message";
import { Conversion } from "src/models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";
import useSuccessNotification from "components/utils/SuccessNotification";
import useErrorNotification from "components/utils/ErrorNotification";

type Props = {
  selectedConversion: Conversion;
};

const ConversionMessageWidget = ({ selectedConversion }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [conversion, setConversion] = useState<Conversion>(selectedConversion);

  const { currentUser } = useContext(UserContext);

  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const showSuccess = useSuccessNotification();
  const showError = useErrorNotification();

  const addMessage = async () => {
    const body = textareaRef.current?.value;
    if (!body) {
      showError({ message: "Message cannot be empty" });
      return;
    }

    const uid = currentUser?.uid;
    if (!uid) {
      showError({ message: "User not logged in" });
      return;
    }

    textareaRef.current!.value = "";

    const message: Message = new Message({
      body,
      timestamp: new Date(),
      senderUid: currentUser?.uid,
    });
    const updatedConversion = conversion.addMessage(message);
    const result = await conversionService.update(updatedConversion);
    if (result) {
      setConversion(updatedConversion);
      showSuccess({ message: "Message sent successfully" });
      // sleep for 100ms to allow the DOM to update
      await new Promise((resolve) => setTimeout(resolve, 100));
      containerRef.current?.scrollTo(0, containerRef.current?.scrollHeight);
    }
  };

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
    <Flex w="100%" h="100%" direction={"column"}>
      <div
        ref={containerRef}
        style={{
          flex: 1, // This will allow the div to take up all available space
          maxHeight: "20em",
          borderRadius: "20px",
          border: "1px solid lightgray",
          padding: "6px",
          overflowY: "scroll",
        }}
        onWheel={handleScroll}
      >
        {conversion.messages.map((message, index) => (
          <Box my={4} key={index}>
            <ConversionMessageTile
              fromSelf={message.fromSelf(currentUser)}
              text={message.body}
              key={index}
            />
          </Box>
        ))}
        <InputGroup
          position={"sticky"}
          bottom={0}
          marginTop={"auto"}
          alignItems={"center"}
          zIndex={2} // Ensure the InputGroup stays above other content
        >
          <Textarea
            focusBorderColor="#ED7D31"
            placeholder="Send a message..."
            background={"white"}
            ref={textareaRef}
          ></Textarea>
          <InputRightElement h="100%">
            <IconButton
              colorScheme="orange"
              onClick={addMessage}
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
