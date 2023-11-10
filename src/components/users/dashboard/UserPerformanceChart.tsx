import { Timeframe, divideTimeframeIntoSegments } from "models/enums/Timeframe";
import BarChart from "components/utils/BarChart";
import React, { useEffect, useState } from "react";
import {
  Conversion,
  ConversionSegment,
  segmentConversionsByTimeframe,
} from "models/Conversion";

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

  const generateBarChartSegments = (convSegment: ConversionSegment) => {
    return {
      xAxisLabel: convSegment.segmentLabel,
      data: [
        {
          series: "Conversions",
          value: convSegment.conversions.length,
        },
        {
          series: "Earnings",
          value: convSegment.conversions.reduce(
            (acc, curr) => acc + curr.affliateLink.commission,
            0
          ),
        },
      ],
    };
  };

  const maxSegmentEarnings = Math.max(
    ...conversionSegments.map((seg) =>
      seg.conversions.reduce(
        (acc, curr) => acc + curr.affliateLink.commission,
        0
      )
    )
  );

  const maxSegmentConversions = Math.max(
    ...conversionSegments.map((seg) => seg.conversions.length)
  );

  return (
    <BarChart
      segments={conversionSegments.map((convSegment) =>
        generateBarChartSegments(convSegment)
      )}
      leftAxisLabel={{
        label: "Conversions",
        start: 0,
        end: maxSegmentConversions,
      }}
      rightAxisLabel={{
        label: "Earnings (CAD)",
        start: 0,
        end: maxSegmentEarnings,
      }}
      series={[
        {
          name: "Conversions",
          color: "#076AFF",
        },
        {
          name: "Earnings",
          color: "#3FB54D",
        },
      ]}
    />
  );
};

export default UserPerformanceChart;
