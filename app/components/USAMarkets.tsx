'use client'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { isMobile } from 'react-device-detect'
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
import { useUSAMarketsData } from '../useUSAMarketsData'
dayjs.extend(isBetween)

export const USAMarkets = () => {
  const { data } = useUSAMarketsData()

  const customTooltip = (_, name, props) => {
    const ratio = (props.payload[name].priceChangeRatio - 1) * 100
    const ratioLabel =
      ratio > 0 ? `+${ratio.toFixed(2)}%` : `${ratio.toFixed(2)}%`
    const price = Number(props.payload[name].price).toFixed(2)
    return [`$${price}(${ratioLabel})`, name]
  }
  const colors = [
    '#82ca9d',
    '#8884d8',
    '#CB80AB',
    '#E6D9A2',
    '#FFBE98',
    '#F05A7E',
    '#125B9A',
    '#0B8494',
  ]

  const symbols = data.length > 0 ? Object.keys(data[0]).slice(1) : []
  console.log(symbols)

  return (
    <>
      <h2 className="text-center font-bold text-2xl">米国三指数</h2>
      <div className="text-center mb-4">（最大60日間まで）</div>
      <div className="h-[500px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: isMobile ? -10 : 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              style={{ userSelect: 'none' }}
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis domain={['auto', 'auto']} style={{ userSelect: 'none' }} />
            <Tooltip formatter={customTooltip} />
            <Legend />
            {symbols &&
              symbols.map((symbol, i) => (
                <Line
                  key={symbol}
                  type="monotone"
                  dataKey={`${symbol}.priceChangeRatio`}
                  stroke={colors[colors.length - i]}
                  name={symbol}
                  dot={false}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
