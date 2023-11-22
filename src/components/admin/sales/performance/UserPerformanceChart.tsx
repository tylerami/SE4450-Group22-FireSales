import { Timeframe } from "models/enums/Timeframe";
import BarChart, { AxisSide, BarChartSegment } from "components/utils/BarChart";
import React, { useCallback } from "react";
import {
  Conversion,
  ConversionSegment,
  segmentConversionsByTimeframe,
  totalCommission,
  totalGrossProfit,
} from "models/Conversion";

const UserPerformanceChart = ({
  conversions,
  timeframe,
}: {
  conversions: Conversion[];
  timeframe: Timeframe;
}) => {
  const conversionSegments: () => ConversionSegment[] = useCallback(() => {
    return segmentConversionsByTimeframe(conversions, timeframe);
  }, [conversions, timeframe]);

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
        {
          series: "Profit Generated",
          value: totalGrossProfit(convSegment.conversions),
        },
      ],
    };
  };

  const maxSegmentProfit = Math.max(
    ...conversionSegments().map((seg) => totalGrossProfit(seg.conversions))
  );

  const maxSegmentConversions = Math.max(
    ...conversionSegments().map((seg) => seg.conversions.length)
  );

  return (
    <BarChart
      segments={conversionSegments().map((convSegment) =>
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
          color: "#B53F8A",
          axis: AxisSide.left,
        },
        {
          name: "Commission",
          color: "#9807FF",
          axis: AxisSide.right,
        },
        {
          name: "Profit Generated",
          color: "#3FB59B",
          axis: AxisSide.right,
        },
      ]}
    />
  );
};

export default UserPerformanceChart;
