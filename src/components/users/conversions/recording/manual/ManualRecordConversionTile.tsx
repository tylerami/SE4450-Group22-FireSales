import React, { useContext, useEffect, useState } from "react";
import {
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  IconButton,
  InputGroup,
  Text,
  Heading,
  InputLeftElement,
  Icon,
  Box,
} from "@chakra-ui/react";
import { ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Conversion,
  ConversionAttachmentGroup,
} from "../../../../../models/Conversion";
import { FaDollarSign } from "react-icons/fa";
import { AffiliateLink } from "models/AffiliateLink";
import { UserContext } from "components/auth/UserProvider";
import { CompensationGroup } from "models/CompensationGroup";
import { Customer } from "models/Customer";
import { CustomerService } from "services/interfaces/CustomerService";
import { DependencyInjection } from "models/utils/DependencyInjection";
import { formatMoney } from "models/utils/Money";
import { parseDateString } from "models/utils/Date";

type Props = {
  compensationGroup: CompensationGroup;
  errorText?: string;
  setConversionGroup: (conversionGroup: ConversionAttachmentGroup) => void;
  rowIndex?: number;
  setIsValid: (bool: boolean) => void;
};

const RecordConversionTile = ({
  compensationGroup,
  errorText,
  setConversionGroup,
  rowIndex,
  setIsValid,
}: Props) => {
  const customerService: CustomerService =
    DependencyInjection.customerService();

  const [dateString, setDate] = useState<string>("");
  const [affiliateLink, setAffiliateLink] = useState<AffiliateLink | null>(
    null
  );
  const [customerName, setCustomerName] = useState<string>("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [saleAmount, setSaleAmount] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const changeCustomer = async (customerName: string) => {
    setCustomerName(customerName);
    let customer: Customer = new Customer({
      fullName: customerName,
    });
    if (customerName.length > 5) {
      const customerSearch: Customer[] = await customerService.searchByName(
        customerName
      );
      if (customerSearch.length > 0) {
        customer = customerSearch[0];
      }
    }

    setCustomer(customer);
  };

  const handleSelectAffiliateLink = (affiliateLink: AffiliateLink) => {
    setAffiliateLink(affiliateLink);
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    setAttachments(Array.from(event.target.files ?? []));
    handleSave();
  };

  const triggerFileUpload = () => {
    const fileInput = document.getElementById(`file-upload-${rowIndex}`);
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const handleAttachmentsButton = () => {
    if (attachments.length > 0) {
      setAttachments([]);
    } else {
      triggerFileUpload();
    }
  };

  const { currentUser } = useContext(UserContext);

  const handleSave = async () => {
    if (!currentUser) return;

    if (customer == null) {
      setIsValid(false);
      return;
    }

    if (!affiliateLink) {
      setIsValid(false);
      return;
    }

    if (dateString.trim() === "") {
      setIsValid(false);
      return;
    }

    const dateOccurred = parseDateString(dateString, "yyyy-mm-dd");

    const conversion: Conversion = Conversion.fromManualInput({
      dateOccurred,
      affiliateLink,
      customer,
      amount: Number(saleAmount),
      compensationGroupId: compensationGroup.id,
      userId: currentUser.uid,
    });

    const conversionGroup: ConversionAttachmentGroup = {
      conversion,
      attachments,
    };
    setConversionGroup(conversionGroup);
  };

  const affiliateLinks: AffiliateLink[] = compensationGroup.affiliateLinks;

  affiliateLinks.sort((a, b) => a.clientId.localeCompare(b.clientId));

  const betSizeNotSufficient =
    saleAmount.trim() !== "" &&
    affiliateLink != null &&
    Number(saleAmount) < affiliateLink?.minBetSize;

  const attachmentsValid = attachments.length > 0;
  const dateValid = dateString.trim() !== "";
  const customerValid = customer != null;
  const affiliateLinkValid = affiliateLink != null;

  useEffect(() => {
    const validateConversion = () =>
      attachmentsValid && dateValid && customerValid && affiliateLinkValid;
    const isValid = validateConversion();
    console.log("isValid", isValid);
    setIsValid(isValid);
  }, [affiliateLinkValid, attachmentsValid, customerValid, dateValid]);

  return (
    // Entire component row
    <React.Fragment>
      <Flex
        borderRadius={"12px"}
        p={3}
        border={errorText ? "1px solid #FF38385A" : undefined}
        alignItems={{ base: "center", xl: "start" }}
        direction={{ base: "column", xl: "row" }}
        w="100%"
        gap={4}
      >
        {rowIndex && (
          <Heading
            alignSelf={{ base: "start", xl: "start" }}
            mt={{ base: 0, xl: 3 }}
            size="sm"
          >
            {rowIndex}
          </Heading>
        )}

        {/* FIRST ROW */}
        <Flex
          justifyContent={"space-between"}
          gap={4}
          flex={2}
          w={{ base: "100%", xl: "60%" }}
        >
          <Input
            type="date"
            width={"35%"}
            value={dateString}
            onChange={(e) => {
              setDate(e.target.value);
              handleSave();
            }}
          />
          <Menu>
            <MenuButton
              fontSize="sm"
              width={"50%"}
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              {affiliateLink
                ? affiliateLink.description()
                : "Select Affiliate Link"}
            </MenuButton>
            <MenuList>
              {compensationGroup.affiliateLinks.map((link, index) => (
                <MenuItem
                  fontSize="sm"
                  key={index}
                  onClick={() => {
                    handleSelectAffiliateLink(link);
                    handleSave();
                  }}
                >
                  {link.description()}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Flex alignItems={"center"} direction={"column"} width={"25%"}>
            <InputGroup width={"100%"}>
              <InputLeftElement>
                <Icon as={FaDollarSign} color="gray" />
              </InputLeftElement>
              <Input
                pl={8}
                type="number"
                placeholder="Bet size"
                focusBorderColor={betSizeNotSufficient ? "red.500" : undefined}
                border={betSizeNotSufficient ? "1px solid red" : undefined}
                value={saleAmount}
                onChange={(e) => {
                  setSaleAmount(e.target.value);
                  handleSave();
                }}
              />
            </InputGroup>
            {betSizeNotSufficient && (
              <Text fontSize={"sm"} textAlign={"center"} color="red" ml={2}>
                Min. {formatMoney(affiliateLink?.minBetSize)}
              </Text>
            )}
          </Flex>
        </Flex>
        {/* SECOND ROW */}
        <Flex
          w={{ base: "100%", xl: "40%" }}
          justifyContent={"space-between"}
          gap={4}
        >
          <Input
            width={"70%"}
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => {
              changeCustomer(e.target.value);
              handleSave();
            }}
          />

          <Flex alignItems={"center"} direction={"column"} width={"35%"}>
            <InputGroup width={"100%"}>
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
                  id={`file-upload-${rowIndex}`}
                />
                {attachments.length <= 0 ? " Upload Files" : "Remove Files"}
              </Button>
            </InputGroup>
            {attachments.length <= 0 ? (
              <Text fontSize={"sm"} textAlign={"center"} color="red" ml={2}>
                Min. 1 file
              </Text>
            ) : (
              <React.Fragment>
                <Box h={1} />
                {attachments.map((file, index) => (
                  <Text fontSize="2xs" key={index} textAlign={"center"} ml={2}>
                    {file.name}
                  </Text>
                ))}
              </React.Fragment>
            )}
          </Flex>
        </Flex>
      </Flex>
      {errorText && <Text color="#FF3838">{errorText}</Text>}
    </React.Fragment>
  );
};

export default RecordConversionTile;
