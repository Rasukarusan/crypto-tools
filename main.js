import dotenv from "dotenv";
dotenv.config();

/**
 * UTC時間をJSTに変換
 */
const utcToJst = (utcDate) => {
  const jstDate = new Date(utcDate.getTime());
  return jstDate.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
};

/**
 * 日付文字列をUnixTimeに変換
 */
const dateToUnixTime = (dateString) => {
  const date = new Date(dateString);
  const unixTime = Math.floor(date.getTime() / 1000);
  return unixTime;
};

// @see https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
async function getKlines() {
  const url = "https://api.binance.com/api/v3/klines";
  const symbol = "BTCJPY"; // BTCJPY BTCUSDT SUIUSDT
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
  const interval = "1h";
  const startTime = dateToUnixTime("2024-09-01 00:00:00");
  const timeZone = "9";
  const limit = 5;
  const params = {
    symbol,
    interval,
    startTime,
    timeZone,
    limit,
  };
  const queryString = new URLSearchParams(params).toString();

  try {
    /**
     *
     * [
     *   [
     *     1499040000000,      // Kline open time
     *     "0.01634790",       // Open price
     *     "0.80000000",       // High price
     *     "0.01575800",       // Low price
     *     "0.01577100",       // Close price
     *     "148976.11427815",  // Volume
     *     1499644799999,      // Kline Close time
     *     "2434.19055334",    // Quote asset volume
     *     308,                // Number of trades
     *     "1756.87402397",    // Taker buy base asset volume
     *     "28.46694368",      // Taker buy quote asset volume
     *     "0"                 // Unused field, ignore.
     *   ]
     * ]
     */
    const res = await fetch(`${url}?${queryString}`, { params }).then((res) =>
      res.json()
    );
    res.forEach((v) => {
      const openTime = utcToJst(new Date(v[0]));
      const openPrice = v[1];
      const highPrice = v[2];
      const lowPrice = v[3];
      console.log(openTime, openPrice);
    });
  } catch (error) {
    console.error("Error fetching price from Binance API:", error);
  }
}

getKlines();
