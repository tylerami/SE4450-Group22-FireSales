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

export const options = {
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
      stacked: true,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Revenue",
      data: [200, 400, 600, 400, 300, 1000, 200],
      backgroundColor: "red",
      stack: "Stack 0",
      maxBarThickness: 20,
    },
    {
      label: "Earnings",
      data: [200, 400, 600, 400, 300, 1000, 200],
      backgroundColor: "orange",
      stack: "Stack 1",
      maxBarThickness: 20,
    },
  ],
};

const UserPerformanceSummaryChart = () => {
  return <Bar options={options} data={data} />;
};

export default UserPerformanceSummaryChart;
