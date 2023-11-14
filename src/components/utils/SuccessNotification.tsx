import React from "react";
import { useToast, ToastId } from "@chakra-ui/react";

type SuccessNotificationProps = {
  message?: string;
};

const useSuccessNotification = () => {
  const toast = useToast();

  const showSuccess = (props: SuccessNotificationProps) => {
    const { message = "Success!" } = props;

    // Customize this ID for unique toast instances if needed
    const id: ToastId = "success-notification";

    if (!toast.isActive(id)) {
      toast({
        id,
        title: message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return showSuccess;
};

export default useSuccessNotification;
