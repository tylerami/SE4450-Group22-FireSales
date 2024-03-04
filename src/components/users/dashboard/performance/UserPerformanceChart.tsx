import { Timeframe } from "src/models/enums/Timeframe";
import BarChart, { AxisSide, BarChartSegment } from "components/utils/BarChart";
import React from "react";
import {
  Conversion,
  ConversionSegment,
  segmentConversionsByTimeframe,
  totalCommission,
  totalGrossProfit,
} from "src/models/Conversion";

const UserPerformanceChart = ({
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
          series: "Commission",
          value: totalCommission(convSegment.conversions),
        },
      ],
    };
  };

  const maxSegmentProfit = Math.max(
    ...conversionSegments.map((seg) => totalGrossProfit(seg.conversions))
  );

  const maxSegmentConversions = Math.max(
    ...conversionSegments.map((seg) => seg.conversions.length)
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
        end: maxSegmentProfit,
      }}
      series={[
        {
          name: "Conversions",
          color: "#3F6EB5",
          axis: AxisSide.left,
        },
        {
          name: "Commission",
          color: "#07FF7F",
          axis: AxisSide.right,
        },
      ]}
    />
  );
};

export default UserPerformanceChart;
