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

export type BarChartSegments = {
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
  series: { name: string; color: string }[];
  segments: BarChartSegments[];
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
        type: "linear" as const,
        display: true,
        position: "left" as const,
        suggestedMin: leftAxisLabel?.start,
        suggestedMax: leftAxisLabel?.end,
      },
      y1: {
        title: {
          display: rightAxisLabel?.label ? true : false,
          text: rightAxisLabel?.label,
        },
        type: "linear" as const,
        display: rightAxisLabel !== undefined,
        position: "right" as const,
        suggestedMin: rightAxisLabel?.start,
        suggestedMax: rightAxisLabel?.end,
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
        stack: `Stack ${index}`,
        maxBarThickness,
      })),
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarChart;
