'use client'
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
import { useFetchData } from '../useFetchData'
import { TimePeriodTabs } from './TimePeriodTabs'

export const Graph = () => {
  const { data } = useFetchData()

  const customTooltip = (value, name, props) => {
    if (name === 'SUI') {
      return [
        `$${Number(props.payload.sui.originalPrice).toFixed(2)}`,
        'SUI Price',
      ]
    }
    if (name === 'BTC') {
      return [
        `$${Number(props.payload.btc.originalPrice).toFixed(2)}`,
        'BTC Price',
      ]
    }
    return [value, name]
  }

  return (
    <div className="h-[500px] mx-auto">
      <div className="mb-8">
        <TimePeriodTabs
          onClick={async () => {
            console.log('hoge')
          }}
        />
      </div>
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
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis domain={['auto', 'auto']} />
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
