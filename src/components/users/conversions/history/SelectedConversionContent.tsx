import React, { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Conversion } from "models/Conversion";
import { CloseIcon } from "@chakra-ui/icons";
import ConversionMessageWidget from "components/common/conversions/ConversionMessagesWidget";
import { ConversionService } from "services/interfaces/ConversionService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import useSuccessNotification from "components/utils/SuccessNotification";
import { FaTrash } from "react-icons/fa";
import useConfirmationModal from "components/utils/ConfirmationModal";

type Props = {
  selectedConversion: Conversion;
  exit: () => void;
};

const SelectedConversionContent = ({ selectedConversion, exit }: Props) => {
  const conversionService: ConversionService =
    DependencyInjection.conversionService();

  const [conversion, setConversion] = useState<Conversion>(selectedConversion);

  const [attachments, setAttachments] = useState<File[]>([]);

  const showSuccess = useSuccessNotification();

  const { openModal, ConfirmationModal } = useConfirmationModal();

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    setAttachments(Array.from(event.target.files ?? []));
  };

  const handleAttachmentsButton = () => {
    if (attachments.length > 0) {
      setAttachments([]);
    } else {
      triggerFileUpload();
    }
  };

  const triggerFileUpload = () => {
    const fileInput = document.getElementById(`file-upload`);
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const imageService = DependencyInjection.imageService();

  const saveNewAttachments = async () => {
    const updatedConversion = await imageService.uploadConversionAttachments(
      conversion,
      attachments
    );

    const result = await conversionService.update(updatedConversion);

    if (result) {
      setConversion(updatedConversion);
      setAttachments([]);
      showSuccess({ message: "Attachments updated successfully" });
    }
  };

  const deleteAttachment = async (url: string) => {
    const newAttachments = conversion.attachmentUrls.filter(
      (attachmentUrl) => attachmentUrl !== url
    );

    const updatedConversion = new Conversion({
      ...conversion,
      attachmentUrls: newAttachments,
    });

    const result = await conversionService.update(updatedConversion);

    if (result) {
      setConversion(updatedConversion);
      showSuccess({ message: "Attachment deleted successfully" });
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
      <ConfirmationModal />
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

      <Flex
        gap={10}
        justifyContent={"space-evenly"}
        alignItems={"center"}
        w="100%"
        maxW="100%"
      >
        {conversion.attachmentUrls.map((url, index) => (
          <Stack key={index}>
            <Image
              onClick={() => {
                handleImageClick(url);
              }}
              cursor={"pointer"}
              maxH="20em"
              src={url}
            />
            <IconButton
              onClick={() => {
                openModal({
                  modalText: "Are you sure you want to delete this attachment?",
                  onConfirm: async () => {
                    await deleteAttachment(url);
                  },
                });
              }}
              aria-label={""}
              size={"sm"}
              width={"min"}
              alignSelf={"center"}
              colorScheme="gray"
              icon={<FaTrash />}
            />
          </Stack>
        ))}

        {attachments.map((file, index) => (
          <Stack key={index}>
            <Image
              onClick={() => {
                handleImageClick(URL.createObjectURL(file));
              }}
              cursor={"pointer"}
              maxH="20em"
              src={URL.createObjectURL(file)}
              key={index}
            />
            <Text alignSelf={"center"} color="green">
              New
            </Text>
          </Stack>
        ))}
      </Flex>

      <InputGroup gap={4} width={"100%"}>
        {attachments.length > 0 && (
          <Button
            colorScheme={"green"}
            size="md"
            w="100%"
            onClick={saveNewAttachments}
          >
            Save New Attachments
          </Button>
        )}
        <Button
          colorScheme={attachments.length > 0 ? "red" : "gray"}
          size="md"
          w="100%"
          onClick={handleAttachmentsButton}
        >
          <Input
            accept="image/*"
            type="file"
            multiple
            hidden
            onChange={handleFilesChange}
            id={`file-upload`}
          />
          {attachments.length <= 0 ? " Upload Files" : "Remove Files"}
        </Button>
      </InputGroup>

      {conversion && (
        <ConversionMessageWidget selectedConversion={conversion} />
      )}
    </React.Fragment>
  );
};

export default SelectedConversionContent;
