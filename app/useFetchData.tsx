import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { fetchDataAtom } from './store/fetchData/atom'
import { dateToUnixTime, normalizeData } from './util'

const fetchData = async (interval = '1d', startTime, endTime) => {
  const params = { interval, startTime, endTime }
  const queryString = new URLSearchParams(params).toString()
  const res = await fetch(`/api/binance?${queryString}`).then((res) =>
    res.json(),
  )
  console.log(res)
  if (!res.result) {
    return []
  }
  const result = []
  const dates = res.data.BTCUSDT.map((item) => item.date)
  dates.forEach((date, index) => {
    result.push({
      date,
      sui: {
        price: res.data.SUIUSDT[index].price,
      },
      btc: {
        price: res.data.BTCUSDT[index].price,
      },
    })
  })
  return result
}

export const useFetchData = () => {
  const [data, setData] = useAtom(fetchDataAtom)
  const fetchAndRefresh = async (interval = '1d', startTime, endTime) => {
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
