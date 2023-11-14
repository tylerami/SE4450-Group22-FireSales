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
import { Conversion } from "models/Conversion";
import { formatDateString } from "utils/Date";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

type Props = {
  conversions: Conversion[];
};

const BulkRecordConversionsProcessedTable = ({ conversions }: Props) => {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const tableColumns: {
    label: string;
    getValue: (conv: Conversion) => string | number;
  }[] = [
    {
      label: "Conversion ID",
      getValue: (conv: Conversion) => conv.id,
    },
    {
      label: "Date",
      getValue: (conv: Conversion) => formatDateString(conv.dateOccured),
    },
    {
      label: "Affilate Link",
      getValue: (conv: Conversion) => conv.affiliateLink.description(),
    },
    {
      label: "Bet size",
      getValue: (conv: Conversion) => conv.amount,
    },
    {
      label: "Customer Name",
      getValue: (conv: Conversion) => conv.customer.fullName,
    },
    {
      label: "Commission",
      getValue: (conv: Conversion) => conv.affiliateLink.commission,
    },
    {
      label: "Status",
      getValue: (conv: Conversion) => conv.status,
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
      <Flex gap={4} w="100%">
        <Icon color="green" as={CheckCircleIcon} />
        <Heading color="green">
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

export default BulkRecordConversionsProcessedTable;
