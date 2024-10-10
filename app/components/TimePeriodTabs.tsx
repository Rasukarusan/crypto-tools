import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { searchParamsAtom } from '../store/searchParams/atom'

type Tab = '1D' | '7D' | '1M' | '1Y'

interface Period {
  startTime: string
  endTime: string
}

export const TimePeriodTabs = () => {
  const tabs: Tab[] = ['1D', '7D', '1M', '1Y']
  const [selectedTab, setSelectedTab] = useState<Tab>('1D')
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom)

  const getPeriod = (tab: Tab): Period => {
    const format = 'YYYY-MM-DD HH:mm:ss'
    let startTime = dayjs().format(format)
    const endTime = dayjs().format(format)
    switch (tab) {
      case '1D': {
        startTime = dayjs().subtract(1, 'd').format(format)
        break
      }
      case '7D': {
        startTime = dayjs().subtract(7, 'd').format(format)
        break
      }
      case '1M': {
        startTime = dayjs().subtract(1, 'M').format(format)
        break
      }
      case '1Y': {
        startTime = dayjs().subtract(1, 'y').format(format)
        break
      }
      default:
    }
    return { startTime, endTime }
  }

  return (
    <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded-md">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab}
          onClick={() => {
            setSelectedTab(tab)
            const { startTime, endTime } = getPeriod(tab)
            setSearchParams({ ...searchParams, startTime, endTime })
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
