/**
 * UTC時間をJSTに変換
 */
export const utcToJst = (utcDate) => {
  const jstDate = new Date(utcDate.getTime())
  return jstDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
}

/**
 * 日付文字列をUnixTimeに変換
 */
export const dateToUnixTime = (dateString) => {
  const date = new Date(dateString)
  const unixTime = date.getTime()
  return unixTime
}

// Function to normalize the price data
export const normalizeData = (data) => {
  if (!data.length) {
    return []
  }
  const symbols = Object.keys(data[0]).slice(1)
  return data.map((entry) => {
    const v = {}
    for (const symbol of symbols) {
      const initialPrice = data[0][symbol].price
      v[symbol] = {}
      v[symbol].price = entry[symbol].price / initialPrice
      v[symbol].originalPrice = entry[symbol].price
    }
    const result = {
      date: entry.date,
      ...v,
    }
    return result
  })
}
