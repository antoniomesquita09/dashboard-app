"use client"

import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

const fetchCPU = async () => {
  const { data } = await axios.get("http://localhost:8081/cpu");
  return data;
};
const fetchMemory = async () => {
  const { data } = await axios.get("http://localhost:8081/memory");
  return data;
};
// const fetchKubernetes = async () => {
//   const { data } = await axios.get("http://localhost:8081/kubernetes");
//   return data;
// };

const SimpleLineChart = () => {
  const { data: cpus } = useQuery('cpu', fetchCPU)
  const { data: memories } = useQuery('memory', fetchMemory)
  // const { data: kubernetes, isLoading } = useQuery('kubernetes', fetchKubernetes)
  
  return (
    <>
      <h2>CPU Chart</h2>

      <LineChart
        width={600}
        height={400}
        data={cpus}
        margin={{
          top: 15,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date_time" />
        <YAxis
          dataKey="percentage"
          label={{
            value: "%",
            style: { textAnchor: 'middle' },
            // angle: -90,
            position: 'left',
            offset: 0,
          }}
        />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="percentage" stroke="#82ca9d" />
      </LineChart>

      <hr style={{ borderTop: "3px solid #bbb", margin: "20px 0", width: "100%" }} />
      <h2>Memory Chart</h2>
      
      <LineChart
        width={600}
        height={400}
        data={memories}
        margin={{
          top: 15,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date_time" />
        <YAxis
          label={{
            value: "MB",
            style: { textAnchor: 'middle' },
            position: 'left',
            offset: 0,
          }}
        />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="used" stroke="#ff0000" />
        {/* <Line type="monotone" dataKey="total" stroke="#82ca9d" /> */}
        <Line type="monotone" dataKey="committed" stroke="#8884d8" />
      </LineChart>

      <hr style={{ borderTop: "3px solid #bbb", margin: "20px 0", width: "100%" }} />
      <h2>Kubernetes Chart</h2>

      <LineChart
        width={600}
        height={400}
        data={cpus}
        margin={{
          top: 15,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="percentage" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          // activeDot={{ r: 8 }}
        /> */}
        <Line type="monotone" dataKey="percentage" stroke="#82ca9d" />
        {/* <Line type="monotone" dataKey="amt" stroke="#ff0000" /> */}
      </LineChart>
    </>
  );
};

export default SimpleLineChart;
