import dayjs from 'dayjs'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // 米国3指数
    // sp500: '^GSPC', NYダウ: '^DJI', NASDAQ総合: '^IXIC', usdjpy: 'USDJPY=X'
    const symbols = ['^GSPC', '^DJI', '^IXIC', 'USDJPY=X']

    const startDate = new Date('2024-09-23').getTime() / 1000 // 開始日
    const endDate = new Date('2024-09-24').getTime() / 1000 // 終了日
    for (const symbol of symbols) {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startDate}&period2=${endDate}&interval=15m`
      try {
        const res = await fetch(url).then((res) => res.json())
        console.log(symbol)
        res.chart.result[0].timestamp.forEach((timestamp, i) => {
          const date = dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm')
          const price = res.chart.result[0].indicators.quote[0].close[i]
          console.log(i, date, price)
        })
        console.log(res.chart.result[0].indicators.quote[0].close)
        console.log(symbol, res.chart.result[0].timestamp.length)
        console.log(res.chart.result[0].indicators.quote[0].close.length)
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error)
      }
    }
    const data = []
    return NextResponse.json({ result: true, data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ result: false })
  }
}
