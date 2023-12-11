import React, { useState } from "react";
import {
  Flex,
  Heading,
  Icon,
  IconButton,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { formatDateString } from "models/utils/Date";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { formatMoney } from "models/utils/Money";
import { Conversion } from "models/Conversion";

type Props = {
  conversionsByNumber: Record<number, Conversion> | null;
  attachments: File[];
};

const AdminRecordConversionsProcessedTable = ({
  conversionsByNumber,
  attachments,
}: Props) => {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const conversions = Object.values(conversionsByNumber ?? []);

  const getConversionNumber = (conv: Conversion): number | null => {
    const numString: string | undefined = Object.entries(
      conversionsByNumber ?? {}
    ).find(([_, value]) => value.id === conv.id)?.[0];
    if (numString === undefined) return null;
    return Number.parseInt(numString);
  };

  const getAttachmentsByNumber = (): Record<number, File[]> => {
    const attachmentsByNumber: Record<number, File[]> = {};
    attachments.forEach((attachment) => {
      const num = getAttachmentNumber(attachment);
      if (attachmentsByNumber[num] === undefined) {
        attachmentsByNumber[num] = [];
      }
      attachmentsByNumber[num].push(attachment);
    });
    return attachmentsByNumber;
  };

  const getAttachmentNumber = (attachment: File): number => {
    const numString = attachment.name.split("_")[0].replace("conv", "");
    const num = Number.parseInt(numString);
    return num;
  };

  const getAttachmentNames = (num: number): string[] => {
    const attachments = getAttachmentsByNumber()[num];
    if (attachments === undefined) return [];
    return attachments.map((attachment) => attachment.name);
  };

  const tableColumns: {
    label: string;
    getValue: (conv: Conversion) => string | number;
  }[] = [
    {
      label: "Number",
      getValue: (conv: Conversion) =>
        getConversionNumber(conv)?.toString() ?? "Error",
    },
    {
      label: "Date",
      getValue: (conv: Conversion) => formatDateString(conv.dateOccurred),
    },
    {
      label: "Affilate Link",
      getValue: (conv: Conversion) => conv.affiliateLink.description(),
    },
    {
      label: "Bet size",
      getValue: (conv: Conversion) => formatMoney(conv.amount),
    },
    {
      label: "Customer Name",
      getValue: (conv: Conversion) => conv.customer.fullName,
    },
    {
      label: "Commission",
      getValue: (conv: Conversion) =>
        formatMoney(conv.affiliateLink.commission),
    },
    {
      label: "Code",
      getValue: (conv: Conversion) => conv.assignmentCode ?? "N/A",
    },
    {
      label: "Attachments",
      getValue: (conv: Conversion) => {
        const convNumber = getConversionNumber(conv);
        if (convNumber === null) return "None";
        const attachmentNames: string[] = getAttachmentNames(convNumber);
        if (attachmentNames.length === 0) return "None";
        return `${attachmentNames.length} uploaded`;
      },
    },
  ];

  const maxRowsPerPage = 10;

  const totalPages = Math.ceil(conversions.length / maxRowsPerPage);

  const nextPage = () => {
    if (pageIndex === totalPages - 1) return;
    setPageIndex((prev) => prev + 1);
  };

  const prevPage = () => {
    if (pageIndex === 0) return;
    setPageIndex((prev) => prev - 1);
  };

  const currentPageConversions = conversions.slice(
    pageIndex * maxRowsPerPage,
    (pageIndex + 1) * maxRowsPerPage
  );

  return (
    <React.Fragment>
      <Flex gap={2} w="100%" alignItems={"center"}>
        <Icon color="green" as={CheckCircleIcon} />
        <Heading size="sm" color="green">
          {conversions.length} Conversions Processed
        </Heading>
        <Spacer />
        {conversions.length > maxRowsPerPage && (
          <React.Fragment>
            <IconButton
              isDisabled={pageIndex === 0}
              onClick={prevPage}
              icon={<ChevronLeftIcon />}
              aria-label={""}
            />
            <Text>
              Page {pageIndex + 1} / {totalPages}
            </Text>
            <IconButton
              isDisabled={pageIndex === totalPages - 1}
              onClick={nextPage}
              icon={<ChevronRightIcon />}
              aria-label={""}
            />
          </React.Fragment>
        )}
      </Flex>
      <Table size="sm">
        <Thead>
          <Tr>
            {tableColumns.map((property, i) => {
              return (
                <Th key={i} textAlign={"center"}>
                  {property.label}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {currentPageConversions.map((sale, i) => (
            <Tr key={i} _hover={{ background: "rgba(237, 125, 49, 0.26)" }}>
              {tableColumns.map((property, i) => {
                return (
                  <Td key={i} textAlign={"center"}>
                    {property.getValue(sale)}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </React.Fragment>
  );
};

export default AdminRecordConversionsProcessedTable;
