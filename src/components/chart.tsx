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
const fetchKubernetes = async () => {
  const { data } = await axios.get("http://localhost:8081/kubernetes");
  return data;
};

const filterContainersMemory = (containers: any[]) => {
  return containers?.reduce((accumulator: number, currentValue: { memory_usage: string; }) =>
    accumulator + parseInt(currentValue.memory_usage?.replace('Ki', '')), 0
  )
}

const filterContainersCPU = (containers: any[]) => {
  return containers?.reduce((accumulator: number, currentValue: { cpu_usage: string; }) =>
    accumulator + parseInt(currentValue.cpu_usage?.replace('n', '')), 0
  )
}

const SimpleLineChart = () => {
  const { data: cpus } = useQuery('cpu', fetchCPU, { refetchInterval: 5000 })
  const { data: memories } = useQuery('memory', fetchMemory, { refetchInterval: 5000 })
  const { data: kubernetes } = useQuery('kubernetes', fetchKubernetes, { refetchInterval: 5000 })

  const parsedKube = kubernetes?.map(elem => (
    elem?.map(({ id, pod_name, pod_status, date_time, containers }) => ({
      id,
      pod_name,
      pod_status,
      date_time,
      containers,
      total_memory: filterContainersMemory(containers),
      total_cpu: filterContainersCPU(containers)
    }))
  ))

  console.log(parsedKube)
  
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
        <Line type="monotone" isAnimationActive={false} dot={false} dataKey="percentage" stroke="#82ca9d" />
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
        <Line type="monotone" isAnimationActive={false} dot={false} dataKey="used" stroke="#ff0000" />
        {/* <Line type="monotone" dataKey="total" stroke="#82ca9d" /> */}
        <Line type="monotone" isAnimationActive={false} dot={false} dataKey="committed" stroke="#8884d8" />
      </LineChart>

      <hr style={{ borderTop: "3px solid #bbb", margin: "20px 0", width: "100%" }} />
      <h2>Kubernetes Chart</h2>

      {parsedKube?.map((pod) => (
        <>
          <br/>
          <h3>Pod: {pod[0].pod_name} - CPU</h3>
          <LineChart
            id={pod[0].pod_name}
            width={600}
            height={400}
            data={pod}
            margin={{
              top: 15,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="total_cpu" />
            <YAxis
              label={{
                value: "n ",
                style: { textAnchor: 'middle' },
                position: 'left',
                offset: 0,
              }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" isAnimationActive={false} dot={false} dataKey="total_cpu" stroke="#eb3449" />
            {/* <Line type="monotone" dataKey="amt" stroke="#ff0000" /> */}
          </LineChart>

          <br/>
          <h3>Pod: {pod[0].pod_name} - Memory</h3>
          <LineChart
            id={pod[0].pod_name}
            width={600}
            height={400}
            data={pod}
            margin={{
              top: 15,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="total_memory" />
            <YAxis
              label={{
                value: "Ki ",
                style: { textAnchor: 'middle' },
                position: 'left',
                offset: 0,
              }}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" isAnimationActive={false} dot={false} dataKey="total_memory" stroke="#34ebe8" />
            {/* <Line type="monotone" dataKey="amt" stroke="#ff0000" /> */}
          </LineChart>
        </>
      ))}

    </>
  );
};

export default SimpleLineChart;


