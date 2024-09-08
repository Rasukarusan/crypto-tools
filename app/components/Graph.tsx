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
    return [`$${Number(props.payload[name].originalPrice).toFixed(2)}`, name]
  }
  const symbols = data && data.length > 0 && Object.keys(data[0]).slice(1)
  const colors = ['#82ca9d', '#8884d8']

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
          {symbols &&
            symbols?.map((symbol, i) => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={`${symbol}.price`}
                stroke={colors[i]}
                name={symbol}
                dot={false}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
