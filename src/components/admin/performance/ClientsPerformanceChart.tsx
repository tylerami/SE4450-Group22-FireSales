import { Timeframe } from "models/enums/Timeframe";
import BarChart, { AxisSide, BarChartSegment } from "components/utils/BarChart";
import React from "react";
import {
  Conversion,
  ConversionSegment,
  segmentConversionsByTimeframe,
  totalCostOfConversions,
  totalGrossProfit,
  totalRevenue,
} from "models/Conversion";

const ClientsPerformanceChart = ({
  conversions,
  timeframe,
}: {
  conversions: Conversion[];
  timeframe: Timeframe;
}) => {
  const conversionSegments: ConversionSegment[] = segmentConversionsByTimeframe(
    conversions,
    timeframe
  );

  const generateBarChartSegment = (
    convSegment: ConversionSegment
  ): BarChartSegment => {
    return {
      xAxisLabel: convSegment.segmentLabel,
      data: [
        {
          series: "Conversions",
          value: convSegment.conversions.length,
        },
        {
          series: "Revenue",
          value: totalRevenue(convSegment.conversions),
        },
        {
          series: "COGS",
          value: totalCostOfConversions(convSegment.conversions),
        },

        {
          series: "Profit",
          value: convSegment.conversions.reduce(
            (acc, curr) => acc + curr.affiliateLink.commission,
            0
          ),
        },
      ],
    };
  };

  const maxSegmentEarnings = Math.max(
    ...conversionSegments.map((seg) => totalRevenue(seg.conversions))
  );

  const maxSegmentConversions = Math.max(
    ...conversionSegments.map((seg) => Math.max(10, seg.conversions.length))
  );

  return (
    <BarChart
      segments={conversionSegments.map((convSegment) =>
        generateBarChartSegment(convSegment)
      )}
      leftAxisLabel={{
        label: "Conversions",
        start: 0,
        end: maxSegmentConversions,
      }}
      rightAxisLabel={{
        label: "$CAD",
        start: 0,
        end: maxSegmentEarnings,
      }}
      series={[
        {
          name: "Conversions",
          color: "#4D3FB5",
          axis: AxisSide.left,
        },
        {
          name: "Revenue",
          color: "#07B0FF",
          axis: AxisSide.right,
        },
        {
          name: "COGS",
          color: "#FF0000",
          axis: AxisSide.right,
        },

        {
          name: "Profit",
          color: "#3FB54D",
          axis: AxisSide.right,
        },
      ]}
    />
  );
};

export default ClientsPerformanceChart;
