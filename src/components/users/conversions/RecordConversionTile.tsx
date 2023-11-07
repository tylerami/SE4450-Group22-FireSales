import React, { useState } from "react";
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
  InputRightElement,
  Text,
  Heading,
  InputLeftElement,
  Icon,
  Box,
} from "@chakra-ui/react";
import { AttachmentIcon, ChevronDownIcon, DeleteIcon } from "@chakra-ui/icons";
import { Sale } from "../../../models/sale";
import { customerIdFromName } from "../../../models/customer";
import { FaDollarSign } from "react-icons/fa";

// List of sportsbooks can be moved outside the component if it doesn't change, to prevent re-creation on each render.
const sportsbooks = ["pointsbet", "betano", "bet99"];

type Props = {
  // add a prop for deleting a row
  deleteRow: () => void;
  setConversion: (conversion: Sale) => void;
  rowIndex?: number;
};

const RecordConversionTile = ({
  deleteRow,
  setConversion,
  rowIndex: rowNumber,
}: Props) => {
  const [dateString, setDate] = useState<string>("");
  const [sportsbookId, setSportsbook] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [saleAmount, setSaleAmount] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSportsbookSelect = (sportsbook: string) => {
    setSportsbook(sportsbook);
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

  const handleSave = () => {
    // TODO: get userId from auth context
    const userId = "1234";
    const commission = 0;

    const sale: Sale = Sale.fromManualInput({
      dateString,
      clientId: sportsbookId,
      customerId: customerIdFromName(customerName),
      amount: Number(saleAmount),
      attachments,
      userId,
      commission,
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
          width={"35%"}
          value={dateString}
          onChange={(e) => {
            setDate(e.target.value);
            handleSave();
          }}
        />
        <Menu>
          <MenuButton width={"35%"} as={Button} rightIcon={<ChevronDownIcon />}>
            {sportsbookId || "Sportsbook"}
          </MenuButton>
          <MenuList>
            {sportsbooks.map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  handleSportsbookSelect(item);
                  handleSave();
                }}
              >
                {item}
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
            placeholder="Sale Amount"
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
