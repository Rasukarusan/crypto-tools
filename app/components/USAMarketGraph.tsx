'use client'
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
import { useUSAMarketsData } from '../hooks/useUSAMarketsData'
import { COLORS } from '../util'

export const USAMarketGraph = () => {
  const { data } = useUSAMarketsData()

  const customTooltip = (_, name, props) => {
    const ratio = (props.payload[name].priceChangeRatio - 1) * 100
    const ratioLabel =
      ratio > 0 ? `+${ratio.toFixed(2)}%` : `${ratio.toFixed(2)}%`
    const price = Number(props.payload[name].price).toFixed(2)
    return [`$${price}(${ratioLabel})`, name]
  }

  const symbols = data.length > 0 ? Object.keys(data[0]).slice(1) : []

  return (
    <>
      <h2 className="text-center font-bold text-2xl select-none">米国三指数</h2>
      <div className="text-center mb-4 select-none">（最大60日間まで）</div>
      <div className="h-[500px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: isMobile ? 0 : 30,
              left: isMobile ? -60 : 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              style={{ userSelect: 'none' }}
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis
              domain={['auto', 'auto']}
              style={{ userSelect: 'none' }}
              tickMargin={isMobile ? -50 : 0}
              axisLine={!isMobile}
            />
            <Tooltip formatter={customTooltip} />
            <Legend wrapperStyle={{ userSelect: 'none' }} />
            {symbols.map((symbol, i) => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={`${symbol}.priceChangeRatio`}
                stroke={COLORS.reverse()[i]}
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
