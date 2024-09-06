import { NextResponse } from 'next/server'
import { dateToUnixTime, utcToJst } from '../../util'

// @see https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
export async function GET(request: Request, { params }) {
  console.log(params)
  try {
    const url = 'https://api.binance.com/api/v3/klines'
    const symbol = 'BTCJPY' // BTCJPY BTCUSDT SUIUSDT
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
    const interval = '1d'
    const startTime = dateToUnixTime('2023-08-01 00:00:00').toString()
    // const endTime = dateToUnixTime('2024-09-01 00:00:00').toString()
    const timeZone = '9'
    const limit = '500'
    const data = {}
    const symbols = ['BTCUSDT', 'SUIUSDT']
    for (const symbol of symbols) {
      const queryParams = {
        symbol,
        interval,
        startTime,
        // endTime,
        timeZone,
        limit,
      }
      const queryString = new URLSearchParams(queryParams).toString()
      const res = await fetch(`${url}?${queryString}`).then((res) => res.json())
      console.log(`------${symbol}------`)
      data[symbol] = []
      for (const v of res) {
        console.log(v[0])
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
