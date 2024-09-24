import dayjs from 'dayjs'
import { type NextRequest, NextResponse } from 'next/server'
import { dateToUnixTime } from '../../../util'

/**
 * 指定期間のUSD/JPYを取得
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const start =
      searchParams.get('startDate') ??
      dayjs().subtract(1, 'd').format('YYYY-MM-DD')
    const end = searchParams.get('endDate') ?? dayjs().format('YYYY-MM-DD')
    const startDate = dateToUnixTime(start) / 1000
    const endDate = dateToUnixTime(end) / 1000

    const symbol = 'USDJPY=X'
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startDate}&period2=${endDate}&interval=15m`
    const res = await fetch(url).then((res) => res.json())
    const data = []
    res.chart.result[0].timestamp.forEach((timestamp, i) => {
      const date = dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm')
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
