import React, { useContext, useState } from "react";
import {
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  InputGroup,
  Text,
  Heading,
  InputLeftElement,
  Icon,
  Box,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Conversion, ConversionAttachmentGroup } from "models///Conversion";
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
  setConversionGroup: (
    conversionGroup: ConversionAttachmentGroup | null
  ) => void;
  rowIndex?: number;
};

const RecordConversionTile = ({
  compensationGroup,
  errorText,
  setConversionGroup,
  rowIndex,
}: Props) => {
  // SERVICES
  const customerService: CustomerService =
    DependencyInjection.customerService();

  // STATE VARIABLES
  const [dateString, setDateString] = useState<string>("");
  const [affiliateLink, setAffiliateLink] = useState<AffiliateLink | null>(
    null
  );
  const [customerName, setCustomerName] = useState<string>("");
  const [saleAmount, setSaleAmount] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const dateValid = (ds: string = dateString): boolean => {
    return parseDateString(ds, "yyyy-mm-dd") != null;
  };

  const customerNameValid = (custName: string = customerName) =>
    custName.trim() !== "" && custName.length > 3;

  const affiliateLinkValid = (link: AffiliateLink | null = affiliateLink) =>
    link != null;

  const saleAmountValid = (amountString: string = saleAmount) => {
    if (affiliateLink == null) return true;
    return (
      amountString.trim() !== "" &&
      affiliateLink != null &&
      Number(amountString) > affiliateLink?.minBetSize
    );
  };

  const attachmentsValid = (files: File[] = attachments) => {
    return files.length > 0;
  };

  const getCustomer = async (
    customerName: string
  ): Promise<Customer | null> => {
    if (!customerNameValid(customerName)) {
      return null;
    }

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

    return customer;
  };

  // CONVERSION VALIDATION
  const { currentUser } = useContext(UserContext);

  const handleSave = async ({
    dateString: newDateString = dateString,
    affiliateLink: newAffiliateLink = affiliateLink,
    customerName: newCustomerName = customerName,
    saleAmount: newSaleAmount = saleAmount,
    attachments: newAttachments = attachments,
  }: {
    dateString?: string;
    affiliateLink?: AffiliateLink | null;
    customerName?: string;
    saleAmount?: string;
    attachments?: File[];
  }) => {
    if (!currentUser) return;

    const conversionIsValid =
      dateValid(newDateString) &&
      affiliateLinkValid(newAffiliateLink) &&
      customerNameValid(newCustomerName) &&
      saleAmountValid(newSaleAmount) &&
      attachmentsValid(newAttachments);

    if (!conversionIsValid) {
      setConversionGroup(null);
      return;
    }

    const dateOccurred: Date | null = parseDateString(
      newDateString,
      "yyyy-mm-dd"
    );
    const customer: Customer | null = await getCustomer(newCustomerName);

    if (affiliateLink == null || customer == null || dateOccurred == null)
      return;

    const conversion: Conversion = Conversion.fromManualInput({
      dateOccurred,
      affiliateLink,
      customer,
      amount: Number(newSaleAmount),
      compensationGroupId: compensationGroup.id,
      userId: currentUser.uid,
    });

    const conversionGroup: ConversionAttachmentGroup = {
      conversion,
      attachments: newAttachments,
    };
    setConversionGroup(conversionGroup);
  };

  // STATE CHANGE HANDLERS

  // Affiliate links are sorted by client ID
  const affiliateLinks: AffiliateLink[] = compensationGroup.affiliateLinks;
  affiliateLinks.sort((a, b) => a.clientId.localeCompare(b.clientId));

  const handleSelectAffiliateLink = (affiliateLink: AffiliateLink) => {
    setAffiliateLink(affiliateLink);
  };

  // Attachment handling
  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(event.target.files ?? []);
    setAttachments(files);
    handleSave({ attachments: files });
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
      handleSave({ attachments: [] });
    } else {
      triggerFileUpload();
    }
  };

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
              setDateString(e.target.value);
              handleSave({ dateString: e.target.value });
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
                    handleSave({ affiliateLink: link });
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
                focusBorderColor={!saleAmountValid() ? "red.500" : undefined}
                border={!saleAmountValid() ? "1px solid red" : undefined}
                value={saleAmount}
                onChange={(e) => {
                  setSaleAmount(e.target.value);
                  handleSave({ saleAmount: e.target.value });
                }}
              />
            </InputGroup>
            {!saleAmountValid() && (
              <Text fontSize={"sm"} textAlign={"center"} color="red" ml={2}>
                Min. {formatMoney(affiliateLink?.minBetSize ?? 0)}
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
              setCustomerName(e.target.value);
              handleSave({ customerName: e.target.value });
            }}
          />

          <Flex alignItems={"center"} direction={"column"} width={"35%"}>
            <InputGroup width={"100%"}>
              <Button
                colorScheme={attachments.length > 0 ? "red" : "gray"}
                size="md"
                w="100%"
                onClick={() => {
                  console.log("clicked");
                  handleAttachmentsButton();
                }}
              >
                <Input
                  accept="image/*"
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => {
                    handleFilesChange(e);
                  }}
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
