import React, { useContext, useMemo, useState } from "react";
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
import {
  Conversion,
  ConversionAttachmentGroup,
  conversionsWithLink,
  conversionsWithType,
  filterConversionsByDateInterval,
} from "src/models/Conversion";
import { FaDollarSign } from "react-icons/fa";
import { AffiliateLink } from "src/models/AffiliateLink";
import { UserContext } from "components/auth/UserProvider";
import {
  CompensationGroup,
  validVersionAtTime as compGroupAtTime,
} from "src/models/CompensationGroup";
import { Customer } from "src/models/Customer";
import { CustomerService } from "services/interfaces/CustomerService";
import { DependencyInjection } from "src/models/utils/DependencyInjection";
import { formatMoney } from "src/models/utils/Money";
import {
  endOfDay,
  firstDayOfCurrentMonth,
  parseDateString,
} from "src/models/utils/Date";
import {
  ConversionType,
  getConversionTypeLabel,
} from "src/models/enums/ConversionType";

type Props = {
  conversions: Conversion[];
  compGroupHistory: CompensationGroup[];
  errorText?: string;
  setConversionGroup: (
    conversionGroup: ConversionAttachmentGroup | null
  ) => void;
  rowIndex?: number;
};

const RecordConversionTile = ({
  conversions: existingConversions,
  compGroupHistory,
  errorText,
  setConversionGroup,
  rowIndex,
}: Props) => {
  // SERVICES
  const customerService: CustomerService =
    DependencyInjection.customerService();

  // STATE VARIABLES
  const [dateString, setDateString] = useState<string>("");

  const [customerName, setCustomerName] = useState<string>("");
  const [saleAmount, setSaleAmount] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const latestCompGroup: CompensationGroup | null = useMemo(
    () => (compGroupHistory.length > 0 ? compGroupHistory[0] : null),
    [compGroupHistory]
  );

  const [activeCompGroup, setActiveCompGroup] =
    useState<CompensationGroup | null>(latestCompGroup);

  const handleSetDateString = (dateString: string) => {
    setDateString(dateString);
    handleSave({ dateString });
    let timestamp: Date | null = parseDateString(dateString, "yyyy-mm-dd");
    if (timestamp == null) {
      setActiveCompGroup(null);
      return;
    }
    timestamp = endOfDay(timestamp);
    const result: CompensationGroup | null = compGroupAtTime(
      compGroupHistory,
      timestamp
    );

    setActiveCompGroup(result);
  };

  // Affiliate link settings
  const [affiliateLink, setAffiliateLink] = useState<AffiliateLink | null>(
    null
  );

  const handleSelectAffiliateLink = (affiliateLink: AffiliateLink | null) => {
    // todo: all this monthly limit label shit needs refactoring

    setAffiliateLink(affiliateLink);

    setConversionType(ConversionType.freeBet);
    setConvTypeDropDownSubtext("");

    if (affiliateLink == null) return;
    if (activeCompGroup == null) return;
    setConversionTypeOptions(
      activeCompGroup.conversionTypesForClient(affiliateLink.clientId)
    );

    if (affiliateLink?.monthlyLimit) {
      const previousConversionsThisMonth: number =
        filterConversionsByDateInterval(
          conversionsWithLink(existingConversions, affiliateLink),
          {
            fromDate: firstDayOfCurrentMonth(),
          }
        ).length;

      setAffiliateLinkDropDownSubtext(
        `Used ${previousConversionsThisMonth} / ${affiliateLink.monthlyLimit} (Resets monthly)`
      );
    }
  };

  const [affiliateLinkDropDownSubtext, setAffiliateLinkDropDownSubtext] =
    useState<string>("");

  // Conversion type settings
  const [conversionTypeOptions, setConversionTypeOptions] = useState<
    ConversionType[]
  >([]);
  const convTypeDropDownEnabled = conversionTypeOptions.length > 0;
  const [conversionType, setConversionType] = useState<ConversionType>(
    ConversionType.freeBet
  );
  const [convTypeDropDownSubtext, setConvTypeDropDownSubtext] =
    useState<string>("");

  const getReferralIncentivesUsedThisMonth = () => {
    let relevantConversions = filterConversionsByDateInterval(
      existingConversions,
      {
        fromDate: firstDayOfCurrentMonth(),
      }
    );
    relevantConversions = conversionsWithType(
      existingConversions,
      ConversionType.retentionIncentive
    );
    return relevantConversions.length;
  };

  const handleSetConversionType = (convType: ConversionType) => {
    // todo: all this monthly limit label shit needs refactoring
    if (convType === ConversionType.retentionIncentive) {
      const incentiveAmount = retentionIncentiveAmount();
      const monthlyLimit = retentionIncentiveMonthlyLimit();
      const incentivesUsedThisMonth = getReferralIncentivesUsedThisMonth();
      if (incentiveAmount === undefined || monthlyLimit === undefined) {
        throw new Error(
          "Retention incentive amount or monthly limit undefined"
        );
      }
      setSaleAmount(incentiveAmount.toString());
      setConvTypeDropDownSubtext(
        `${incentivesUsedThisMonth} / ${monthlyLimit} (Resets monthly)`
      );
      setAffiliateLinkDropDownSubtext("");
    } else {
      setConvTypeDropDownSubtext("");
      handleSelectAffiliateLink(affiliateLink);
    }

    setConversionType(convType);
  };

  const dateValid = (ds: string = dateString): boolean => {
    return parseDateString(ds, "yyyy-mm-dd") != null;
  };

  const customerNameValid = (custName: string = customerName): boolean =>
    custName.trim() !== "" && custName.length > 3;

  const affiliateLinkValid = (link: AffiliateLink | null = affiliateLink) =>
    link != null;

  const saleAmountValid = (amountString: string = saleAmount): boolean => {
    if (affiliateLink == null) return true;
    if (conversionType === ConversionType.retentionIncentive) return true;
    return (
      amountString.trim() !== "" &&
      affiliateLink != null &&
      Number(amountString) >= affiliateLink?.minBetSize
    );
  };

  const attachmentsValid = (files: File[] = attachments): boolean => {
    return files.length > 0;
  };

  const retentionIncentiveMonthlyLimit = (): number | undefined => {
    if (affiliateLink == null) return undefined;
    if (activeCompGroup == null) return undefined;
    return activeCompGroup.retentionIncentiveForClient(affiliateLink?.clientId)
      ?.monthlyLimit;
  };

  const retentionIncentiveAmount = (): number | undefined => {
    if (affiliateLink == null) return undefined;
    if (activeCompGroup == null) return undefined;
    return activeCompGroup.retentionIncentiveForClient(affiliateLink?.clientId)
      ?.amount;
  };

  const conversionTypeIsValid = (
    convType: ConversionType = conversionType
  ): boolean => {
    if (convType === ConversionType.retentionIncentive) {
      const numRetentionIncentivesUsedThisMonth =
        getReferralIncentivesUsedThisMonth();
      const monthlyLimit: number | undefined = retentionIncentiveMonthlyLimit();

      if (monthlyLimit === undefined) {
        throw new Error("Monthly limit is undefined");
      }

      return numRetentionIncentivesUsedThisMonth + 1 <= monthlyLimit;
    }
    return true;
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
    conversionType: newConversionType = conversionType,
  }: {
    dateString?: string;
    affiliateLink?: AffiliateLink | null;
    customerName?: string;
    saleAmount?: string;
    attachments?: File[];
    conversionType?: ConversionType;
  }) => {
    if (!currentUser) return;

    const conversionIsValid =
      dateValid(newDateString) &&
      affiliateLinkValid(newAffiliateLink) &&
      customerNameValid(newCustomerName) &&
      saleAmountValid(newSaleAmount) &&
      attachmentsValid(newAttachments) &&
      conversionTypeIsValid(newConversionType) &&
      activeCompGroup != null;

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

    const conversion: Conversion = new Conversion({
      dateOccurred,
      affiliateLink,
      type: conversionType,
      customer,
      amount: Number(newSaleAmount),
      compensationGroupId: activeCompGroup.id,
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
  const affiliateLinks: AffiliateLink[] = latestCompGroup?.affiliateLinks ?? [];
  affiliateLinks.sort((a, b) => a.clientId.localeCompare(b.clientId));

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
        gap={2}
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
          gap={2}
          flex={2}
          w={{ base: "100%", xl: "60%" }}
        >
          <Input
            type="date"
            fontSize="sm"
            width={"30%"}
            value={dateString}
            onChange={(e) => handleSetDateString(e.target.value)}
          />

          <Input
            width={"30%"}
            fontSize="sm"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              handleSave({ customerName: e.target.value });
            }}
          />

          <Flex alignItems={"center"} direction={"column"} width={"45%"}>
            <Menu>
              <MenuButton
                fontSize="sm"
                width={"100%"}
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                {affiliateLink
                  ? affiliateLink.description
                  : "Select Affiliate Link"}
              </MenuButton>
              <MenuList>
                {activeCompGroup?.affiliateLinks.map((link, index) => (
                  <MenuItem
                    fontSize="sm"
                    key={index}
                    onClick={() => {
                      handleSelectAffiliateLink(link);
                      handleSave({ affiliateLink: link });
                    }}
                  >
                    {link.description}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Text fontSize={"sm"} textAlign={"center"} color="red" ml={2}>
              {affiliateLinkDropDownSubtext}
            </Text>
          </Flex>
        </Flex>
        {/* SECOND ROW */}
        <Flex
          w={{ base: "100%", xl: "40%" }}
          justifyContent={"space-between"}
          gap={2}
        >
          <Flex alignItems={"center"} direction={"column"} width={"40%"}>
            <Menu>
              <MenuButton
                fontSize="sm"
                isDisabled={!convTypeDropDownEnabled}
                width={"100%"}
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                {convTypeDropDownEnabled
                  ? getConversionTypeLabel(conversionType)
                  : "Conversion Type"}
              </MenuButton>
              <MenuList>
                {conversionTypeOptions.map((convType, index) => (
                  <MenuItem
                    fontSize="sm"
                    key={index}
                    onClick={() => {
                      handleSetConversionType(convType as ConversionType);
                      handleSave({ conversionType: convType });
                    }}
                  >
                    {getConversionTypeLabel(convType as ConversionType)}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Text fontSize={"sm"} textAlign={"center"} color="red" ml={2}>
              {convTypeDropDownSubtext}
            </Text>
          </Flex>

          <Flex alignItems={"center"} direction={"column"} width={"30%"}>
            <InputGroup width={"100%"}>
              <InputLeftElement>
                <Icon as={FaDollarSign} color="gray" />
              </InputLeftElement>
              <Input
                pl={8}
                type="number"
                isReadOnly={
                  conversionType === ConversionType.retentionIncentive
                }
                fontSize={"sm"}
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

          <Flex alignItems={"center"} direction={"column"} width={"30%"}>
            <InputGroup width={"100%"}>
              <Button
                fontSize={"sm"}
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
              <Text fontSize={"xs"} textAlign={"center"} color="red" ml={2}>
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
