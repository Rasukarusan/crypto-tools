import { useAsyncEffect } from 'ahooks'
import { useAtom, useAtomValue } from 'jotai'
import { searchParamsAtom } from '../store/searchParams/atom'
import { usdDataAtom } from '../store/usdData/atom'

export const useUsdData = () => {
  const [data, setData] = useAtom(usdDataAtom)
  const searchParams = useAtomValue(searchParamsAtom)

  useAsyncEffect(async () => {
    const { startTime, endTime } = searchParams
    const queryString = new URLSearchParams({ startTime, endTime }).toString()
    const res = await fetch(`/api/yahoo-finance/usd?${queryString}`).then(
      (res) => res.json(),
    )
    if (!res.result) {
      setData([])
    }
    setData(res.data)
  }, [searchParams])
  return { data }
}
