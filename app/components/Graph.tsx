'use client'
import { useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// Function to normalize the price data
const normalizeData = (data) => {
  const suiInitialPrice = data[0].sui.price
  const btcInitialPrice = data[0].btc.price

  return data.map((entry) => ({
    date: entry.date,
    sui: {
      price: (entry.sui.price / suiInitialPrice) * 100, // SUI as percentage of initial price
      originalPrice: entry.sui.price, // Keep the original price
    },
    btc: {
      price: (entry.btc.price / btcInitialPrice) * 100, // BTC as percentage of initial price
      originalPrice: entry.btc.price, // Keep the original price
    },
  }))
}

export const Graph = () => {
  const [data, setData] = useState([])

  const onClick = async () => {
    const res = await fetch('/api/binance').then((res) => res.json())
    console.log(res)
    if (!res.result) return
    const result = []
    const dates = res.data.BTCUSDT.map((item) => item.date) // 日付を取り出す
    dates.forEach((date, index) => {
      result.push({
        date,
        sui: {
          price: res.data.SUIUSDT[index].price,
        },
        btc: {
          price: res.data.BTCUSDT[index].price,
        },
      })
    })
    console.log(result)
    setData(normalizeData(result))
  }

  // Custom tooltip formatter
  const customTooltip = (value, name, props) => {
    if (name === 'SUI') {
      return [`${props.payload.sui.originalPrice}`, 'SUI Price']
    }
    if (name === 'BTC') {
      return [`${props.payload.btc.originalPrice}`, 'BTC Price']
    }
    return [value, name]
  }

  return (
    <div style={{ height: '500px' }}>
      <button type="button" onClick={onClick}>
        Click
      </button>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={customTooltip} />
          <Legend />
          <Line
            type="monotone"
            dataKey="sui.price"
            stroke="#8884d8"
            name="SUI"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="btc.price"
            stroke="#82ca9d"
            name="BTC"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
