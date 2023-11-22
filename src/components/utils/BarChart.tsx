import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export enum AxisSide {
  left = "left",
  right = "right",
}

export type BarChartSegment = {
  xAxisLabel: string;
  data: { series: string; value: number }[];
};

const BarChart = ({
  series,
  segments,
  maxBarThickness = 20,
  leftAxisLabel,
  rightAxisLabel,
}: {
  series: { name: string; color: string; axis: AxisSide }[];
  segments: BarChartSegment[];
  maxBarThickness?: number;
  leftAxisLabel?: {
    label?: string;
    start?: number;
    end?: number;
  };
  rightAxisLabel?: {
    label?: string;
    start?: number;
    end?: number;
  };
}) => {
  const roundTo2Digits = (num) => {
    if (num < 100) {
      // Handles numbers with less than 3 digits
      return Math.round(num / 10) * 10;
    }
    const digits = Math.ceil(Math.log10(num + 1));
    const scaleFactor = Math.pow(10, digits - 2);
    return Math.round(num / scaleFactor) * scaleFactor;
  };

  const yLeftAxisMax: number | undefined = leftAxisLabel?.end
    ? roundTo2Digits(leftAxisLabel?.end * 1.2)
    : undefined;
  const yRightAxisMax: number | undefined = rightAxisLabel?.end
    ? roundTo2Digits(rightAxisLabel?.end * 1.2)
    : undefined;

  const yLeftAxisMin: number = leftAxisLabel?.start ? leftAxisLabel?.start : 0;
  const yRightAxisMin: number = rightAxisLabel?.start
    ? rightAxisLabel?.start
    : 0;

  const yLeftAxisRange = yLeftAxisMax ? yLeftAxisMax - yLeftAxisMin : undefined;
  const yRightAxisRange = yRightAxisMax
    ? yRightAxisMax - yRightAxisMin
    : undefined;

  const ticksSegments = 10;

  const yLeftAxisStepSize = yLeftAxisRange
    ? yLeftAxisRange / ticksSegments
    : undefined;
  const yRightAxisStepSize = yRightAxisRange
    ? yRightAxisRange / ticksSegments
    : undefined;

  const options = {
    plugins: {},
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        title: {
          display: leftAxisLabel?.label ? true : false,
          text: leftAxisLabel?.label,
        },
        ticks: {
          major: {
            enabled: true,
          },
          stepSize: yLeftAxisStepSize,
          beginAtZero: true,
        },
        type: "linear" as const,
        display: true,
        position: "left" as const,
        suggestedMin: yLeftAxisMin,
        suggestedMax: yLeftAxisMax,
      },
      y1: {
        title: {
          display: rightAxisLabel?.label ? true : false,
          text: rightAxisLabel?.label,
        },
        grid: {
          display: true,
        },
        ticks: {
          major: {
            enabled: true,
          },
          stepSize: yRightAxisStepSize,
          beginAtZero: true,
        },
        type: "linear" as const,
        display: rightAxisLabel !== undefined,
        position: "right" as const,
        suggestedMin: yRightAxisMin,
        suggestedMax: yRightAxisMax,
      },
    },
  };

  const labels = segments.map((segment) => segment.xAxisLabel);

  function getSeriesDataSet(seriesName: string) {
    return segments.map((segment) => {
      const data = segment.data.find(
        (data) => data.series === seriesName
      )?.value;
      return data ? data : 0;
    });
  }

  const data = {
    labels,
    datasets: [
      ...series.map((series, index) => ({
        label: series.name,
        data: getSeriesDataSet(series.name),
        backgroundColor: series.color,
        yAxisID: series.axis === AxisSide.left ? "y" : "y1",
        parsing: {
          yAxisID: "y", //series.axis === AxisSide.left ? "y" : "y1",
        },

        stack: `Stack ${index}`,
        maxBarThickness,
      })),
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarChart;
