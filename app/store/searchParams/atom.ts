import dayjs from 'dayjs'
import { atom } from 'jotai'
import { dateToUnixTime } from '../../util'

interface SearchParams {
  interval: string
  startTime: string
  endTime: string
  symbols: string
}

const format = 'YYYY-MM-DD HH:mm:ss'

export const searchParamsAtom = atom<SearchParams>({
  interval: '15m',
  startTime: dateToUnixTime(dayjs().subtract(1, 'd').format(format)).toString(),
  endTime: dateToUnixTime(dayjs().format(format)).toString(),
  symbols: 'BTCUSDT,SUIUSDT',
})
