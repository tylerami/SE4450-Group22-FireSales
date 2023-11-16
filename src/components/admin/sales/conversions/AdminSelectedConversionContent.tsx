import React from "react";
import { Button, Flex, Heading, IconButton, Spacer } from "@chakra-ui/react";
import { Conversion } from "models/Conversion";
import { CloseIcon } from "@chakra-ui/icons";
import ImageComponent from "components/utils/ImageComponent";
import ConversionMessageWidget from "components/common/conversions/ConversionMessagesWidget";

type Props = {
  selectedConversion: Conversion;
  exit: () => void;
};

const SelectedConversionContent = ({ selectedConversion, exit }: Props) => {
  return (
    <React.Fragment>
      <Flex justifyContent={"start"} alignItems={"center"} gap={6}>
        <IconButton
          onClick={() => {
            exit();
          }}
          icon={<CloseIcon />}
          aria-label={""}
        />
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          {selectedConversion.description()}
        </Heading>

        <Spacer />

        <Button cursor={"default"} _hover={{}} disabled>
          Not Verified
        </Button>
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

      <Flex gap={8}>
        <Button size="lg" colorScheme="green" w="full">
          Approve
        </Button>
        <Button size="lg" colorScheme="red" w="full">
          Deny
        </Button>
      </Flex>

      {selectedConversion && <ConversionMessageWidget />}
    </React.Fragment>
  );
};

export default SelectedConversionContent;
