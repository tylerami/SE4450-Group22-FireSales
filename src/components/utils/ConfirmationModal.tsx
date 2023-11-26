import React, { useState, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

interface ConfirmationModalOptions {
  modalText: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const useConfirmationModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [options, setOptions] = useState<ConfirmationModalOptions | null>(null);

  const openModal = useCallback(
    (modalOptions: ConfirmationModalOptions) => {
      setOptions(modalOptions);
      onOpen();
    },
    [onOpen]
  );

  const handleConfirm = () => {
    options?.onConfirm();
    onClose();
  };

  const handleCancel = () => {
    options?.onCancel?.();
    onClose();
  };

  const ConfirmationModal = () => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{options?.modalText}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
            Yes
          </Button>
          <Button variant="ghost" onClick={handleCancel}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return { openModal, ConfirmationModal };
};

export default useConfirmationModal;
