import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Conversion } from "models/Conversion";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "utils/DependencyInjection";
import { UserContext } from "components/auth/UserProvider";
import { CloseIcon } from "@chakra-ui/icons";
import ImageComponent from "components/utils/ImageComponent";
import ConversionMessageWidget from "components/common/conversions/ConversionMessagesWidget";
import { formatDateString } from "utils/Date";
import { sampleConversions } from "__mocks__/models/Conversion.mock";

type Props = {
  selectedConversion: Conversion;
  exit: () => void;
};

const SelectedConversionContent = ({ selectedConversion, exit }) => {
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

      {selectedConversion && <ConversionMessageWidget />}
    </React.Fragment>
  );
};

export default SelectedConversionContent;
