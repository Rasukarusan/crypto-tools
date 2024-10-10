import { useAtom } from 'jotai'
import type React from 'react'
import { forwardRef, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'
import { searchParamsAtom } from '../store/searchParams/atom'

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

  return (
    <div className="flex items-center justify-center">
      <DatePicker
        dateFormat="yyyy/MM/dd"
        selected={startDate}
        onChange={(date: Date | null) => {
          setStartDate(date)
          setSearchParams({
            ...searchParams,
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
            endTime: dayjs(date).add(1, 'day').format('YYYY-MM-DD 00:00:00'),
          })
        }}
        customInput={<CustomInput ref={refCustomInput} />}
      />
    </div>
  )
}
