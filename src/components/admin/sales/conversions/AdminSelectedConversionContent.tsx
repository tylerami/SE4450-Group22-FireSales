import React, { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Conversion } from "src/models/Conversion";
import { CloseIcon } from "@chakra-ui/icons";
import ConversionMessageWidget from "components/common/conversions/ConversionMessagesWidget";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import { ConversionStatus } from "src/models/enums/ConversionStatus";
import useSuccessNotification from "components/utils/SuccessNotification";

type Props = {
  selectedConversion: Conversion;
  exit: () => void;
};

const SelectedConversionContent = ({ selectedConversion, exit }: Props) => {
  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const [conversion, setConversion] = useState<Conversion>(selectedConversion);

  const showSuccess = useSuccessNotification();

  const handleApproveButton = async () => {
    const newStatus: ConversionStatus = conversion.isApproved()
      ? conversion.isPaid()
        ? ConversionStatus.approvedUnpaid
        : ConversionStatus.approvedPaid
      : ConversionStatus.approvedUnpaid;

    const updatedConversion: Conversion = conversion.changeStatus(newStatus);

    const result = await conversionService.update(updatedConversion);
    if (result) {
      setConversion(updatedConversion);

      showSuccess({ message: "Conversion updated successfully" });
    }
  };

  const handleRejectButton = async () => {
    const newStatus: ConversionStatus = !conversion.isPending()
      ? ConversionStatus.pending
      : ConversionStatus.rejected;

    const updatedConversion: Conversion = conversion.changeStatus(newStatus);

    const result = await conversionService.update(updatedConversion);
    if (result) {
      setConversion(updatedConversion);

      showSuccess({ message: "Conversion updated successfully" });
    }
  };

  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const {
    isOpen: isImageModalOpen,
    onOpen: onImageModalOpen,
    onClose: onImageModalClose,
  } = useDisclosure();

  const handleImageClick = (url: string) => {
    setSelectedImageUrl(url);
    onImageModalOpen();
  };

  const ImageModal = () => (
    <Modal isOpen={isImageModalOpen} onClose={onImageModalClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <IconButton
            onClick={onImageModalClose}
            icon={<CloseIcon />}
            aria-label={""}
          />
        </ModalHeader>
        <ModalBody>
          <Image src={selectedImageUrl} maxW="100%" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <React.Fragment>
      <ImageModal />
      <Flex justifyContent={"start"} alignItems={"center"} gap={6}>
        <IconButton
          onClick={() => {
            exit();
          }}
          icon={<CloseIcon />}
          aria-label={""}
        />
        <Heading as="h1" fontSize={"1.2em"} fontWeight={700}>
          {conversion.description()}
        </Heading>

        <Spacer />

        <Button
          cursor={"default"}
          _hover={{}}
          colorScheme={
            conversion.isPending()
              ? undefined
              : conversion.isApproved()
              ? "green"
              : "red"
          }
          size={"sm"}
          disabled
        >
          {conversion.isPending()
            ? "Unverified"
            : conversion.isApproved()
            ? conversion.isPaid()
              ? "Approved (Paid)"
              : "Approved (Unpaid)"
            : "Rejected"}
        </Button>
      </Flex>

      {conversion.attachmentUrls.length > 0 ? (
        <Flex
          maxH={"40em"}
          gap={10}
          justifyContent={"space-evenly"}
          alignItems={"center"}
          w="100%"
          maxWidth="100%"
        >
          {conversion.attachmentUrls.map((url, index) => (
            <Stack>
              <Image
                onClick={() => {
                  handleImageClick(url);
                }}
                cursor={"pointer"}
                maxH="20em"
                src={url}
                key={index}
              />
            </Stack>
          ))}
        </Flex>
      ) : (
        <Flex justifyContent={"center"} alignItems={"center"} w="100%" h="100%">
          <Heading as="h1" fontSize={"2em"} fontWeight={400}>
            No Attachments
          </Heading>
        </Flex>
      )}

      <Flex gap={8}>
        <Button
          onClick={handleApproveButton}
          size="lg"
          colorScheme="green"
          w="full"
        >
          {conversion.isApproved()
            ? conversion.isPaid()
              ? "Mark as unpaid"
              : "Mark as paid"
            : "Approve"}
        </Button>
        <Button
          onClick={handleRejectButton}
          size="lg"
          colorScheme="red"
          w="full"
        >
          {conversion.isApproved()
            ? "Remove Approval"
            : conversion.isRejected()
            ? "Remove Rejection"
            : "Reject"}
        </Button>
      </Flex>

      {conversion && (
        <ConversionMessageWidget selectedConversion={conversion} />
      )}
    </React.Fragment>
  );
};

export default SelectedConversionContent;
