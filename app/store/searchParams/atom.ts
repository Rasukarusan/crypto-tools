import dayjs from 'dayjs'
import { atom } from 'jotai'

interface SearchParams {
  startTime: string
  endTime: string
  symbols: string
}

const format = 'YYYY-MM-DD HH:mm:ss'
const initialSearchParams = {
  startTime: dayjs().subtract(1, 'd').format(format),
  endTime: dayjs().format(format),
  symbols: 'BTCUSDT,SUIUSDT,SOLUSDT',
}

export const searchParamsAtom = atom<SearchParams>(initialSearchParams)
