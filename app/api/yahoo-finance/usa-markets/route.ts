import dayjs from 'dayjs'
import { type NextRequest, NextResponse } from 'next/server'
import { dateToUnixTime } from '../../../util'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // 米国三指数
    const symbols = {
      SP500: '^GSPC',
      NYダウ: '^DJI',
      NASDAQ総合: '^IXIC',
    }

    let start =
      searchParams.get('startTime') ??
      dayjs().subtract(1, 'd').format('YYYY-MM-DD')
    let end = searchParams.get('endTime') ?? dayjs().format('YYYY-MM-DD')
    const period = dayjs(end).diff(start, 'day')
    // APIの最大指定期間が60日なので調整
    if (period >= 60) {
      start = dayjs().subtract(59, 'd').format('YYYY-MM-DD')
      end = dayjs().format('YYYY-MM-DD')
    }
    const startDate = dateToUnixTime(start) / 1000
    const endDate = dateToUnixTime(end) / 1000

    const data = {}
    for (const key of Object.keys(symbols)) {
      const symbol = symbols[key]
      data[key] = []
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startDate}&period2=${endDate}&interval=15m`
      console.log({ startDate, endDate, url })
      try {
        const res = await fetch(url).then((res) => res.json())
        console.log(JSON.stringify(res))
        res.chart.result[0].timestamp.forEach((timestamp, i) => {
          const date = dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm')
          const price = res.chart.result[0].indicators.quote[0].close[i]
          const priceChangeRatio =
            price / res.chart.result[0].indicators.quote[0].close[0]
          if (price) {
            data[key].push({ date, price, priceChangeRatio })
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
