import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { fetchDataAtom } from './store/fetchData/atom'
import { dateToUnixTime, normalizeData } from './util'

const fetchData = async (interval, startTime, endTime) => {
  const params = { interval, startTime, endTime }
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
  const fetchAndRefresh = async (interval, startTime, endTime) => {
    const result = await fetchData(interval, startTime, endTime)
    setData(normalizeData(result))
  }
  useEffect(() => {
    ;(async () => {
      const interval = '15m'
      const startTime = dateToUnixTime(
        dayjs().subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss'),
      ).toString()
      const endTime = dateToUnixTime(
        dayjs().format('YYYY-MM-DD HH:mm:ss'),
      ).toString()
      await fetchAndRefresh(interval, startTime, endTime)
    })()
  }, [])
  return { data, fetchData: fetchAndRefresh }
}
