import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { fetchDataAtom } from './store/fetchData/atom'
import { selectSymbolsAtom } from './store/selectSymbols/atom'
import { selectTabAtom } from './store/selectTimePeriod/atom'
import { getIntervalFromTab, normalizeData } from './util'

const fetchData = async (interval, startTime, endTime, selectSymbols) => {
  const params = { interval, startTime, endTime, selectSymbols }
  const queryString = new URLSearchParams(params).toString()
  const res = await fetch(`/api/binance?${queryString}`).then((res) =>
    res.json(),
  )
  if (!res.result) {
    return []
  }
  const result = []
  const symbols = Object.keys(res.data)
  const dates = res.data[symbols[0]].map((item) => item.date)
  dates.forEach((date, index) => {
    const v = { date }
    for (const symbol of symbols) {
      v[symbol] = {}
      v[symbol].price = res.data[symbol][index].price
    }
    result.push(v)
  })
  return result
}

export const useFetchData = () => {
  const [data, setData] = useAtom(fetchDataAtom)
  const selectSymbols = useAtomValue(selectSymbolsAtom)
  const selectTab = useAtomValue(selectTabAtom)

  const fetchAndRefresh = async (interval, startTime, endTime, symbols) => {
    const result = await fetchData(interval, startTime, endTime, symbols)
    setData(normalizeData(result))
  }

  useEffect(() => {
    ;(async () => {
      const { interval, startTime, endTime } = getIntervalFromTab(selectTab)
      const symbols = selectSymbols.map((symbol) => symbol.value).join(',')
      await fetchAndRefresh(interval, startTime, endTime, symbols)
    })()
  }, [selectSymbols, selectTab])
  return { data, setData, fetchData: fetchAndRefresh }
}
