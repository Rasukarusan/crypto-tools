import { useAsyncEffect } from 'ahooks'
import { useAtom, useAtomValue } from 'jotai'
import { searchParamsAtom } from './store/searchParams/atom'
import { usaMarketsDataAtom } from './store/usaMarketsData/atom'

const formatData = (data) => {
  const result = []
  const symbols = Object.keys(data)
  const dates = data[symbols[0]].map((item) => item.date)
  dates.forEach((date, index) => {
    const v = { date }
    for (const symbol of symbols) {
      v[symbol] = { price: 0, priceChangeRatio: 0 }
      v[symbol].price = data[symbol][index].price
      v[symbol].priceChangeRatio = data[symbol][index].priceChangeRatio
    }
    result.push(v)
  })
  return result
}
export const useUSAMarketsData = () => {
  const [data, setData] = useAtom(usaMarketsDataAtom)
  const searchParams = useAtomValue(searchParamsAtom)

  useAsyncEffect(async () => {
    const { startTime, endTime } = searchParams
    const params = { startTime, endTime }
    const queryString = new URLSearchParams(params).toString()
    const res = await fetch(
      `/api/yahoo-finance/usa-markets?${queryString}`,
    ).then((res) => res.json())
    setData(formatData(res.data))
  }, [searchParams.startTime, searchParams.endTime])
  return { data }
}
