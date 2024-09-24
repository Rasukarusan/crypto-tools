import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { searchParamsAtom } from '../store/searchParams/atom'

type Tab = '1D' | '7D' | '1M' | '1Y'

interface Interval {
  interval: string
  startTime: string
  endTime: string
}

export const TimePeriodTabs = () => {
  const tabs: Tab[] = ['1D', '7D', '1M', '1Y']
  const [selectedTab, setSelectedTab] = useState<Tab>('1D')
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom)

  const getIntervalFromTab = (tab: Tab): Interval => {
    const format = 'YYYY-MM-DD HH:mm:ss'
    let interval = '15m'
    let startTime = dayjs().format(format)
    const endTime = dayjs().format(format)
    switch (tab) {
      case '1D': {
        interval = '15m'
        startTime = dayjs().subtract(1, 'd').format(format)
        break
      }
      case '7D': {
        interval = '15m'
        startTime = dayjs().subtract(7, 'd').format(format)
        break
      }
      case '1M': {
        interval = '1h'
        startTime = dayjs().subtract(1, 'M').format(format)
        break
      }
      case '1Y': {
        interval = '1d'
        startTime = dayjs().subtract(1, 'y').format(format)
        break
      }
      default:
    }
    return { interval, startTime, endTime }
  }

  return (
    <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded-md">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab}
          onClick={() => {
            setSelectedTab(tab)
            const { interval, startTime, endTime } = getIntervalFromTab(tab)
            setSearchParams({ ...searchParams, interval, startTime, endTime })
          }}
          className={`px-4 py-1 rounded-md font-medium text-gray-600 hover:bg-gray-200 focus:outline-none ${
            selectedTab === tab ? 'bg-white shadow-md' : ''
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
