import dayjs from 'dayjs'
import { type NextRequest, NextResponse } from 'next/server'
import { dateToUnixTime } from '../../../util'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // 米国3指数 sp500: '^GSPC', NYダウ: '^DJI', NASDAQ総合: '^IXIC', usdjpy: 'USDJPY=X'
    const symbols = ['^GSPC', '^DJI', '^IXIC']

    let start =
      searchParams.get('startDate') ??
      dayjs().subtract(1, 'd').format('YYYY-MM-DD')
    let end = searchParams.get('endDate') ?? dayjs().format('YYYY-MM-DD')
    const period = dayjs(end).diff(start, 'day')
    // APIの最大指定期間が60日なので調整
    if (period >= 60) {
      start = dayjs().subtract(59, 'd').format('YYYY-MM-DD')
      end = dayjs().format('YYYY-MM-DD')
    }
    const startDate = dateToUnixTime(start) / 1000
    const endDate = dateToUnixTime(end) / 1000

    const data = {}
    for (const symbol of symbols) {
      data[symbol] = []
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startDate}&period2=${endDate}&interval=15m`
      try {
        const res = await fetch(url).then((res) => res.json())
        res.chart.result[0].timestamp.forEach((timestamp, i) => {
          const date = dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm')
          const price = res.chart.result[0].indicators.quote[0].close[i]
          if (price) {
            data[symbol].push({ date, price })
          }
        })
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error)
      }
    }

    return NextResponse.json({ result: true, data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ result: false })
  }
}
