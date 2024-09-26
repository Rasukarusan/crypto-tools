import { useAtom } from 'jotai'
import type React from 'react'
import { forwardRef, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'
import { searchParamsAtom } from '../store/searchParams/atom'
import 'dayjs/locale/ja'
dayjs.locale('ja')

export const TimePeriodCalendar: React.FC = () => {
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const refCustomInput = useRef<HTMLInputElement>(null)

  const CustomInput = forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
  >((props, ref) => {
    return (
      <input type="text" ref={ref} {...props} className="border p-1 w-28" />
    )
  })

  const getInterval = (startTime, endTime) => {
    // BinanceAPIで許可されているinterval
    const intervals = {
      '15m': 900,
      '30m': 1800,
      '1h': 3600,
      '2h': 7200,
      '4h': 14400,
      '6h': 21600,
      '8h': 28800,
      '12h': 43200,
      '1d': 86400,
      '3d': 259200,
      '1w': 604800,
      '1M': 2592000,
    }
    const durationInSeconds = Math.abs(dayjs(endTime).diff(startTime, 'second'))
    for (const key of Object.keys(intervals)) {
      if (durationInSeconds / intervals[key] <= 500) {
        return key
      }
    }
    return '15m'
  }

  return (
    <div className="flex items-center justify-center">
      <DatePicker
        dateFormat="yyyy/MM/dd"
        selected={startDate}
        onChange={(date: Date | null) => {
          setStartDate(date)
          setSearchParams({
            ...searchParams,
            interval: getInterval(date, endDate),
            startTime: dayjs(date).format('YYYY-MM-DD 00:00:00'),
          })
        }}
        customInput={<CustomInput ref={refCustomInput} />}
      />
      <div className="mx-2">〜</div>
      <DatePicker
        dateFormat="yyyy/MM/dd"
        selected={endDate}
        onChange={(date: Date | null) => {
          setEndDate(date)
          setSearchParams({
            ...searchParams,
            interval: getInterval(startDate, date),
            endTime: dayjs(date).add(1, 'day').format('YYYY-MM-DD 00:00:00'),
          })
        }}
        customInput={<CustomInput ref={refCustomInput} />}
      />
    </div>
  )
}
