import dayjs from 'dayjs'
import { type NextRequest, NextResponse } from 'next/server'
import { dateToUnixTime } from '../../../util'

/**
 * 本日のUSD/JPYを取得
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const today = dayjs().format('YYYY-MM-DD')
    const startDate = dateToUnixTime(today) / 1000
    const endDate = dateToUnixTime(today) / 1000

    const symbol = 'USDJPY=X'
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startDate}&period2=${endDate}&interval=1d`
    const res = await fetch(url).then((res) => res.json())
    const data = []
    res.chart.result[0].timestamp.forEach((timestamp, i) => {
      const date = dayjs(timestamp * 1000).format('YYYY-MM-DD')
      const price = res.chart.result[0].indicators.quote[0].close[i]
      if (price) {
        data.push({ date, price })
      }
    })
    return NextResponse.json({ result: true, data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ result: false })
  }
}
