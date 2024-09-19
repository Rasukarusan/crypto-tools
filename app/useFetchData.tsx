import { useAsyncEffect } from 'ahooks'
import { useAtom, useAtomValue } from 'jotai'
import { fetchDataAtom } from './store/fetchData/atom'
import { searchParamsAtom } from './store/searchParams/atom'

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
      v[symbol] = { price: 0, priceChangeRatio: 0 }
      const initialPrice = res.data[symbol][0].price
      v[symbol].price = res.data[symbol][index].price
      v[symbol].priceChangeRatio = res.data[symbol][index].price / initialPrice // 開始日から何％動いているかを表す値
    }
    result.push(v)
  })
  return result
}

export const useFetchData = () => {
  const [data, setData] = useAtom(fetchDataAtom)
  const searchParams = useAtomValue(searchParamsAtom)

  const fetchAndRefresh = async (interval, startTime, endTime, symbols) => {
    const result = await fetchData(interval, startTime, endTime, symbols)
    setData(result)
  }

  useAsyncEffect(async () => {
    const { interval, startTime, endTime, symbols } = searchParams
    await fetchAndRefresh(interval, startTime, endTime, symbols)
  }, [searchParams])
  return { data, setData, fetchData: fetchAndRefresh }
}
