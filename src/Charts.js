import React from "react";
import './home-styles.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";


export default function Charts(props) {
  return (
    <div id="charts-main">
    <ResponsiveContainer>
    <BarChart
      data={props.data}
      margin={{
        right: 50,
        bottom:50
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis interval={0} angle={-30}
        dy={20} dataKey="city" />
      <YAxis tickCount={100} dataKey="aqi"/>
      <Tooltip />
      <Bar  width={15} dataKey="aqi" fill="#2E3138" />
    </BarChart>
    </ResponsiveContainer>
    </div>
  );
}
