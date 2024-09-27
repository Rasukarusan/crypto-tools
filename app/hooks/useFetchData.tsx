import { useAsyncEffect } from 'ahooks'
import { useAtom, useAtomValue } from 'jotai'
import { fetchDataAtom } from '../store/fetchData/atom'
import { searchParamsAtom } from '../store/searchParams/atom'

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
  const { prices } = res
  const symbols = Object.keys(prices)
  const dates = prices[symbols[0]].map((item) => item.date)
  dates.forEach((date, index) => {
    const v = { date }
    for (const symbol of symbols) {
      v[symbol] = { price: 0, priceChangeRatio: 0, volume: 0 }
      const initialPrice = prices[symbol][0].price
      v[symbol].price = prices[symbol][index].price
      v[symbol].priceChangeRatio = prices[symbol][index].price / initialPrice // 開始日から何％動いているかを表す値
      v[symbol].volume = prices[symbol][index].volume
    }
    result.push(v)
  })
  console.log(result)
  return result
}

export const useFetchData = () => {
  const [data, setData] = useAtom(fetchDataAtom)
  const searchParams = useAtomValue(searchParamsAtom)

  useAsyncEffect(async () => {
    const { interval, startTime, endTime, symbols } = searchParams
    const result = await fetchData(interval, startTime, endTime, symbols)
    setData(result)
  }, [searchParams])
  return { data }
}
