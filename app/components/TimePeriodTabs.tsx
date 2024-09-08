import dayjs from 'dayjs'
import { useState } from 'react'
import { useFetchData } from '../useFetchData'
import { dateToUnixTime } from '../util'

interface Props {
  onClick: () => void
}

export const TimePeriodTabs: React.FC<Props> = ({ onClick }) => {
  const [selectedTab, setSelectedTab] = useState('1D')
  const tabs = ['1D', '7D', '1M', '1Y']
  const { fetchData } = useFetchData()

  return (
    <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded-md">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab}
          onClick={async () => {
            setSelectedTab(tab)
            const format = 'YYYY-MM-DD HH:mm:ss'
            let interval = ''
            let startTime = dateToUnixTime(dayjs().format(format)).toString()
            const endTime = dateToUnixTime(dayjs().format(format)).toString()
            switch (tab) {
              case '1D': {
                interval = '15m'
                startTime = dateToUnixTime(
                  dayjs().subtract(1, 'd').format(format),
                ).toString()
                break
              }
              case '7D': {
                interval = '15m'
                startTime = dateToUnixTime(
                  dayjs().subtract(7, 'd').format(format),
                ).toString()
                break
              }
              case '1M': {
                interval = '1h'
                startTime = dateToUnixTime(
                  dayjs().subtract(1, 'M').format(format),
                ).toString()
                break
              }
              case '1Y': {
                interval = '1d'
                startTime = dateToUnixTime(
                  dayjs().subtract(1, 'y').format(format),
                ).toString()
                break
              }
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
