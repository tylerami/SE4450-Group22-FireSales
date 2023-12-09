import { useToast, ToastId } from "@chakra-ui/react";

type ErrorNotificationProps = {
  message?: string;
};

const useErrorNotification = () => {
  const toast = useToast();

  const showError = (props: ErrorNotificationProps) => {
    const { message = "An error occurred!" } = props;

    // Customize this ID for unique toast instances if needed
    const id: ToastId = "error-notification";

    if (!toast.isActive(id)) {
      toast({
        id,
        title: message,
        status: "error", // Changed to 'error' to reflect error status
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return showError;
};

export default useErrorNotification;
