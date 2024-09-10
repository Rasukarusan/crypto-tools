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
