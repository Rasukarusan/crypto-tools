import dayjs from 'dayjs'
import { type NextRequest, NextResponse } from 'next/server'
import { dateToUnixTime, utcToJst } from '../../util'

// @see https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    /**
     * Interval          Interval Value
     * ---------------------------------
     * seconds           1s
     * minutes           1m, 3m, 5m, 15m, 30m
     * hours             1h, 2h, 4h, 6h, 8h, 12h
     * days              1d, 3d
     * weeks             1w
     * months            1M
     */
    // const interval = '1d'
    // const startTime = dateToUnixTime('2023-08-01 00:00:00').toString()
    // const endTime = dateToUnixTime('2024-09-01 00:00:00').toString()
    const interval = searchParams.get('interval') ?? '15m'
    const startTime =
      searchParams.get('startTime') ??
      dateToUnixTime(
        dayjs().subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss'),
      ).toString()
    const endTime =
      searchParams.get('endTime') ??
      dateToUnixTime(dayjs().format('YYYY-MM-DD HH:mm:ss')).toString()
    const limit = searchParams.get('limit') ?? '500'
    const url = 'https://api.binance.com/api/v3/klines'
    const timeZone = '9'
    const data = {}
    const symbols = ['BTCUSDT', 'SUIUSDT']
    for (const symbol of symbols) {
      const queryParams = {
        symbol,
        interval,
        startTime,
        endTime,
        timeZone,
        limit,
      }
      const queryString = new URLSearchParams(queryParams).toString()
      const res = await fetch(`${url}?${queryString}`).then((res) => res.json())
      data[symbol] = []
      for (const v of res) {
        const openTime = utcToJst(new Date(v[0]))
        const openPrice = v[1]
        data[symbol].push({ date: openTime, price: openPrice })
      }
    }
    console.log(data)
    return NextResponse.json({ result: true, data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ result: false })
  }
}
