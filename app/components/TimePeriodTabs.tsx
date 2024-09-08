import { useAtom } from 'jotai'
import { selectTabAtom } from '../store/selectTimePeriod/atom'

interface Props {
  onClick: () => void
}

export const TimePeriodTabs: React.FC<Props> = ({ onClick }) => {
  const tabs = ['1D', '7D', '1M', '1Y']
  const [selectedTab, setSelectedTab] = useAtom(selectTabAtom)
  return (
    <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded-md">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab}
          onClick={() => setSelectedTab(tab)}
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
