'use client'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useFetchData } from '../hooks/useFetchData'
import { useUsdData } from '../hooks/useUsdData'
import { searchParamsAtom } from '../store/searchParams/atom'
import { COLORS } from '../util'
import { SymbolSelect } from './SymbolSelect'
import { TimePeriodCalendar } from './TimePeriodCalender'
import { TimePeriodTabs } from './TimePeriodTabs'

export const Graph = () => {
  const { data } = useFetchData()
  const { data: usdData } = useUsdData()
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom)
  const [zoomArea, setZoomArea] = useState({ left: '', right: '' })

  const customTooltip = (_, name, props) => {
    const { price, priceChangeRatio } = props.payload[name]
    const jpy = usdData && usdData.length > 0 ? usdData[0].price : 0
    const jpyLabel = jpy > 0 ? ` / ¥${(jpy * price).toFixed(0)}` : ''
    const ratio = (priceChangeRatio - 1) * 100
    const ratioLabel = `(${ratio > 0 ? '+' : ''}${ratio.toFixed(2)}%)`
    const priceLabel = `$${Number(props.payload[name].price).toFixed(2)}`
    return [`${priceLabel}${jpyLabel} ${ratioLabel}`, name]
  }

  // 通貨を追加した時に、追加した分だけ差分描画させるために、searchParams.symbolsを使わずdataから取得している
  const symbols = data && data.length > 0 && Object.keys(data[0]).slice(1)

  const diffDate = useMemo(() => {
    return dayjs(searchParams.endTime).diff(searchParams.startTime, 'days')
  }, [searchParams.startTime, searchParams.endTime])
  const xAxisInterval = diffDate > 90 ? 30 : diffDate < 2 ? 10 : 40

  return (
    <div className="h-[500px] mx-auto">
      <div className="mb-4 block sm:flex justify-end items-center">
        <div className="mr-4 sm:mb-0 mb-4">
          <TimePeriodCalendar />
        </div>
        <div className="mb-4 sm:mb-0 sm:mr-4 min-w-[250px] w-auto">
          <SymbolSelect />
        </div>
        <TimePeriodTabs />
      </div>
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
          onMouseDown={(e) => {
            if (isMobile) {
              return
            }
            setZoomArea({ ...zoomArea, left: e.activeLabel })
          }}
          onMouseMove={(e) => {
            if (isMobile) {
              return
            }
            setZoomArea({ ...zoomArea, right: e.activeLabel })
          }}
          onMouseUp={(e) => {
            if (isMobile) {
              return
            }
            let { left, right } = zoomArea
            if (!left || !right || left === right) {
              setZoomArea({ left: '', right: '' })
              return
            }
            // 右から左に向けて選択した場合、left:未来, right: 過去となってしまうので入れ替える
            if (dayjs(left).isAfter(right)) {
              const temp = left
              left = right
              right = temp
            }
            setSearchParams({
              ...searchParams,
              startTime: left,
              endTime: right,
            })
            setZoomArea({ left: '', right: '' })
          }}
        >
          <CartesianGrid vertical={false} />
          <ReferenceLine
            yAxisId="1"
            y={1}
            stroke="gray"
            strokeDasharray="3 3"
          />
          <XAxis
            style={{ userSelect: 'none' }}
            dataKey="date"
            tickFormatter={(tick) => {
              const date = dayjs(tick)
              if (diffDate < 2) {
                return date.format('HH:mm')
              }
              return date.format('MM/DD')
            }}
            interval={xAxisInterval}
          />
          <YAxis
            domain={['auto', 'auto']}
            yAxisId="1"
            style={{ userSelect: 'none' }}
            tickMargin={isMobile ? -50 : 0}
            axisLine={!isMobile}
          />
          <Tooltip formatter={customTooltip} />
          <Legend
            wrapperStyle={{ userSelect: 'none' }}
            formatter={(value, entry, index) => {
              const price = Number(data[data.length - 1][value].price)
              const jpy = usdData && usdData.length > 0 ? usdData[0].price : 0
              const jpyLabel = jpy > 0 ? `(¥${(jpy * price).toFixed(0)})` : ''
              return (
                <div>
                  <div>{value}</div>
                  <div>
                    ${price.toFixed(2)}
                    {jpyLabel}
                  </div>
                </div>
              )
            }}
          />
          {symbols &&
            symbols.map((symbol, i) => (
              <Line
                yAxisId="1"
                key={symbol}
                type="monotone"
                dataKey={`${symbol}.priceChangeRatio`}
                stroke={COLORS[i]}
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
