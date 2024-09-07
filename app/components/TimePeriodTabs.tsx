import dayjs from 'dayjs'
import { useState } from 'react'
import { useFetchData } from '../useFetchData'
import { dateToUnixTime } from '../util'

interface Props {
  onClick: () => void
}

export const TimePeriodTabs: React.FC<Props> = ({ onClick }) => {
  const [selectedTab, setSelectedTab] = useState('1D')
  const tabs = ['1D', '7D', '1M', '1Y', '全部']
  const { fetchData } = useFetchData()

  return (
    <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded-md mx-auto">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab}
          onClick={async () => {
            setSelectedTab(tab)
            let interval = ''
            let startTime = dateToUnixTime('2023-08-01 00:00:00').toString()
            const endTime = dateToUnixTime(
              dayjs().format('YYYY-MM-DD HH:mm:ss'),
            ).toString()
            switch (tab) {
              case '1D':
                interval = '15m'
                startTime = dateToUnixTime(
                  dayjs().subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss'),
                ).toString()
                break
              case '7D':
                interval = '15m'
                startTime = dateToUnixTime(
                  dayjs().subtract(7, 'd').format('YYYY-MM-DD HH:mm:ss'),
                ).toString()
                break
              case '1M':
                interval = '1M'
                break
              default:
            }
            await fetchData(interval, startTime, endTime)
          }}
          className={`px-4 py-2 rounded-md font-medium text-gray-600 hover:bg-gray-200 focus:outline-none ${
            selectedTab === tab ? 'bg-white shadow-md' : ''
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
