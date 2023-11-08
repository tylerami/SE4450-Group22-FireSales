import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
import ClientsSummaryTableWidget from "./clients/ClientsSummaryTableWidget";
import PerformanceChartWidget from "./performance/PerformanceChartWidget";
import SalesTeamTableWidget from "./team/SalesTeamTableWidget";

type Props = {};

const AdminDashboardPage = (props: Props) => {
  return (
    <React.Fragment>
      <Flex width={"100%"} px={8} py={2} pt={8}>
        <Heading size="lg" mr={2} fontWeight={400}>
          Welcome,
        </Heading>
        <Heading size="lg" fontWeight={400} color="#ED7D31">
          Tyler
        </Heading>
      </Flex>

      {/* Row of widgets */}
      <Flex
        width={"100%"}
        height={"100%"}
        justifyContent={{ base: "start", xl: "space-evenly" }}
        direction={{ base: "column", xl: "row" }} // Stack on base, horizontal on larger screens
        gap={2}
        p={6}
      >
        {/* Column: Performance chart and table */}
        <Flex
          width={{ base: "100%", xl: "48%" }} // Full width on base, half on larger screens
          direction="column"
          gap={6}
          align="center"
        >
          <PerformanceChartWidget />
          <ClientsSummaryTableWidget />
        </Flex>

        {/* Sales team chart */}
        <Flex
          width={{ base: "100%", xl: "48%" }} // Full width on base, half on larger screens
          direction="column"
          align="center"
        >
          <SalesTeamTableWidget />
        </Flex>
      </Flex>
    </React.Fragment>
  );
};

export default AdminDashboardPage;
