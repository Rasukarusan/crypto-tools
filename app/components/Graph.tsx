'use client'
import dayjs from 'dayjs'
import { useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useFetchData } from '../useFetchData'
import { SymbolSelect } from './SymbolSelect'
import { TimePeriodTabs } from './TimePeriodTabs'

export const Graph = () => {
  const { data, setData } = useFetchData()

  const customTooltip = (_, name, props) => {
    return [`$${Number(props.payload[name].originalPrice).toFixed(2)}`, name]
  }
  const symbols = data && data.length > 0 && Object.keys(data[0]).slice(1)
  const colors = ['#82ca9d', '#8884d8']

  const [zoomArea, setZoomArea] = useState({ left: null, right: null })

  return (
    <div className="h-[500px] mx-auto">
      <div className="mb-4 block sm:flex justify-end items-center">
        <button
          type="button"
          onClick={() => {
            setZoomArea({ left: null, right: null })
          }}
        >
          reset
        </button>
        <div className="mb-4 sm:mb-0 sm:mr-4 min-w-[250px] w-auto">
          <SymbolSelect />
        </div>
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
            left: isMobile ? -40 : 20,
            bottom: 5,
          }}
          onMouseDown={(e) => {
            setZoomArea({ ...zoomArea, left: e.activeLabel })
          }}
          onMouseMove={(e) => {
            setZoomArea({ ...zoomArea, right: e.activeLabel })
          }}
          onMouseUp={() => {
            let { left, right } = zoomArea
            if (!left || !right || left === right) {
              setZoomArea({ left: null, right: null })
              return
            }
            // 右から左に向けて選択した場合、left:未来, right: 過去となってしまうので入れ替える
            if (dayjs(left).isAfter(right)) {
              const temp = left
              left = right
              right = temp
            }
            const newData = data.filter(
              (v) =>
                dayjs(v.date).isAfter(left) && dayjs(v.date).isBefore(right),
            )
            setData(newData)
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            style={{ userSelect: 'none' }}
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={!isMobile}
            yAxisId="1"
            style={{ userSelect: 'none' }}
          />
          <Tooltip formatter={customTooltip} />
          <Legend />
          {symbols &&
            symbols?.map((symbol, i) => (
              <Line
                yAxisId="1"
                key={symbol}
                type="monotone"
                dataKey={`${symbol}.price`}
                stroke={colors[i]}
                name={symbol}
                dot={false}
              />
            ))}
          {zoomArea.left && zoomArea.right ? (
            <ReferenceArea
              yAxisId="1"
              x1={zoomArea.left}
              x2={zoomArea.right}
              strokeOpacity={0.3}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
