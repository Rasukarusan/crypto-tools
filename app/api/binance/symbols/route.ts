import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const currency = searchParams.get('currency') ?? ''

  try {
    const url = 'https://api.binance.com/api/v3/exchangeInfo'
    const res = await fetch(url).then((res) => res.json())
    const symbols = res.symbols
      .map((symbol) => symbol.symbol)
      .filter((v) => v?.includes(currency))
    console.log(symbols)
    return NextResponse.json({ result: true, symbols })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ result: false })
  }
}
