import React, { useContext, useState } from "react";
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
} from "@chakra-ui/react";
import { ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import { Conversion } from "../../../../../models/Conversion";
import { FaDollarSign } from "react-icons/fa";
import { customerSample } from "__mocks__/models/Customer.mock";
import { AffiliateLink } from "models/AffiliateLink";
import { UserContext } from "components/auth/UserProvider";
import { CompensationGroup } from "models/CompensationGroup";

type Props = {
  compensationGroup: CompensationGroup;
  deleteRow: () => void;
  setConversion: (conversion: Conversion) => void;
  rowIndex?: number;
};

const RecordConversionTile = ({
  compensationGroup,
  deleteRow,
  setConversion,
  rowIndex: rowNumber,
}: Props) => {
  const [dateString, setDate] = useState<string>("");
  const [affiliateLink, setAffiliateLink] = useState<AffiliateLink | null>(
    null
  );
  const [customerName, setCustomerName] = useState<string>("");
  const [saleAmount, setSaleAmount] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSelectAffiliateLink = (affiliateLink: AffiliateLink) => {
    setAffiliateLink(affiliateLink);
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(Array.from(event.target.files));
    } else {
      setAttachments([]);
    }
    handleSave();
  };

  const triggerFileUpload = () => {
    const fileInput = document.getElementById("file-upload");
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const { currentUser } = useContext(UserContext);

  const handleSave = () => {
    if (!currentUser) return;

    if (!affiliateLink) {
      // set error
      return;
    }

    const sale: Conversion = Conversion.fromManualInput({
      dateString,
      affiliateLink,
      customer: customerSample,
      amount: Number(saleAmount),
      compensationGroupId: "1234",
      userId: currentUser.uid,
    });
    setConversion(sale);
  };

  return (
    // Entire component row
    <Flex
      alignItems={{ base: "center", xl: "start" }}
      direction={{ base: "column", xl: "row" }}
      w="100%"
      gap={4}
    >
      {rowNumber && (
        <Heading
          alignSelf={{ base: "start", xl: "start" }}
          mt={{ base: 0, xl: 3 }}
          ml={4}
          size="sm"
        >
          {rowNumber}
        </Heading>
      )}

      {/* FIRST ROW */}
      <Flex
        justifyContent={"space-between"}
        gap={4}
        w={{ base: "100%", xl: "50%" }}
      >
        <Input
          type="date"
          width={"30%"}
          value={dateString}
          onChange={(e) => {
            setDate(e.target.value);
            handleSave();
          }}
        />
        <Menu>
          <MenuButton width={"35%"} as={Button} rightIcon={<ChevronDownIcon />}>
            {affiliateLink
              ? affiliateLink.description()
              : "Select Affiliate Link"}
          </MenuButton>
          <MenuList>
            {compensationGroup.affiliateLinks.map((link, index) => (
              <MenuItem
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

        <InputGroup width={"30%"}>
          <InputLeftElement>
            <Icon as={FaDollarSign} color="gray" />
          </InputLeftElement>
          <Input
            pl={8}
            type="number"
            placeholder="Conversion Amount"
            value={saleAmount}
            onChange={(e) => {
              setSaleAmount(e.target.value);
              handleSave();
            }}
          />
        </InputGroup>
      </Flex>
      {/* SECOND ROW */}
      <Flex
        w={{ base: "100%", xl: "50%" }}
        justifyContent={"space-between"}
        gap={4}
      >
        <Input
          width={"60%"}
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => {
            setCustomerName(e.target.value);
            handleSave();
          }}
        />

        <Flex alignItems={"center"} direction={"column"} width={"35%"}>
          <InputGroup width={"100%"}>
            <Button size="md" w="100%" onClick={triggerFileUpload}>
              <Input
                type="file"
                multiple
                hidden
                onChange={handleFilesChange}
                id="file-upload"
              />
              Upload Files
            </Button>
          </InputGroup>
          {attachments.length <= 0 ? (
            <Text textAlign={"center"} color="red" ml={2}>
              Min. 1 file
            </Text>
          ) : (
            <Text
              textAlign={"center"}
              color="green"
              ml={2}
            >{`${attachments.length} files uploaded`}</Text>
          )}
        </Flex>
        <IconButton
          aria-label="Delete row"
          onClick={deleteRow}
          icon={<DeleteIcon />}
        />
      </Flex>
    </Flex>
  );
};

export default RecordConversionTile;
