import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import data from "./data";
import axios from "axios";
import EuroRoundedIcon from "@mui/icons-material/EuroRounded";
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
/* #fdca40-#d9bd76-#c2c3c644-#c2c3c6-#f8e4af-#c2c3c6-#590404-#f8b930-#080708-#a80b0b */
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [error, setError] = useState(null);
  const [customerCount, setCustomerCount] = useState(null);
  const [orderCount, setOrderCount] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [datas, setData] = useState(null);
  const gradientColors = ["#000", "white"];
  const gradientId = "colorGradient";
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://e-commerce-project-backend-yec6.onrender.com/v1/order/allorders"
        );
        const fetchedData = response.data;
        setData(fetchedData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://e-commerce-project-backend-yec6.onrender.com/v1/allcustomers/all"
        );
        const count = response.data.count;
        setCustomerCount(count);
        setLoading(false);
        setError(null);
      } catch (err) {
        setCustomerCount(null);
        setLoading(false);
        setError(error.message);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://e-commerce-project-backend-yec6.onrender.com/v1/order/getallorders"
        );
        const count = response.data.count;
        setOrderCount(count);
        setLoading(false);
        setError(null);
      } catch (err) {
        setOrderCount(null);
        setLoading(false);
        setError(error.message);
      }
    }
    fetchData();
  }, []);

  useEffect(()=>{
    setLoading(true);
    async function getTotalPrice (){
      try{
        const response = await axios.get("https://e-commerce-project-backend-yec6.onrender.com/v1/order/getTotalPrice");
        setTotalPrice(response.data)
        console.log(response.data);
        setLoading(false);
        setError(null);
      }catch (err) {
        setOrderCount(null);
        setLoading(false);
        setError(error.message);
      }
    };
    getTotalPrice();
  },[])

  return (
    <div className="dash">
      <div className="chart1">
      <div className="chart1-title">
        <div className="charts-title">Numbre of sales </div>
        <div className="chart1-buttons">
          <button className="sort" >Week</button>
          <button className="sort" >Month</button>
        </div>
        </div>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart
            width={500}
            height={400}
            data={data.data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                {gradientColors.map((color, index) => (
                  <stop
                    key={index}
                    offset={`${(index / (gradientColors.length - 1)) * 100}%`}
                    stopColor={color}
                  />
                ))}
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="black"/>
            <XAxis dataKey="month" stroke="black"/>
            <YAxis axisLine={false} stroke="black" fill="black"/>
            <Tooltip />
            <Area type="monotone" strokeWidth={2} dataKey="sale" stroke="black" fill={`url(#${gradientId})`}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="chart2">
        <div className="chart2-title">
        <div className="charts-title">Total Customers</div>
        <GroupRoundedIcon fontSize="large"/>
        </div>
        <div className="chart4-profit">
          {loading && <p className="txt">Loading...</p>}
          {error && <p className="txt">Error: {error}</p>}
          {customerCount !== null && <p>{`${customerCount}`}</p>}
        </div>
      </div>
      <div className="chart3">
        <div className="chart3-title">
        <div className="charts-title">Total Orders</div>
        <LocalShippingIcon fontSize="large"/>
        </div>
        <div className="chart3-parent">
          <div className="chart3-counter">
            {loading && <p className="txt">Loading...</p>}
            {error && <p className="txt">Error: {error}</p>}
            {orderCount !== null && <p>{`${orderCount}`}</p>}
          </div>
          <ResponsiveContainer width="50%" height="60%">
            <LineChart width={300} height={100} data={datas}>
              <Line
                type="monotone"
                dataKey="count"
                stroke="#590404"
                strokeWidth={2}
              />
              <Tooltip itemStyle={{ fontSize: '14px'}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="chart4">
        <div className="chart4-title">
          <div className="charts-title">Total Revenues</div>
          <EuroRoundedIcon fontSize="large"/>
        </div>
        <div className="chart4-profit">
          {loading && <p className="txt">Loading...</p>}
          {error && <p className="txt">Error: {error}</p>}
          {totalPrice !== null && <p>${`${totalPrice}`}</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
