/**
 * UTC時間をJSTに変換
 */
export const utcToJst = (utcDate) => {
  const jstDate = new Date(utcDate.getTime());
  return jstDate.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
};

/**
 * 日付文字列をUnixTimeに変換
 */
export const dateToUnixTime = (dateString) => {
  const date = new Date(dateString);
  const unixTime = date.getTime();
  return unixTime;
};

// Function to normalize the price data
export const normalizeData = (data) => {
  const suiInitialPrice = data[0].sui.price;
  const btcInitialPrice = data[0].btc.price;

  return data.map((entry) => ({
    date: entry.date,
    sui: {
      price: entry.sui.price / suiInitialPrice, // SUI as percentage of initial price
      originalPrice: entry.sui.price, // Keep the original price
    },
    btc: {
      price: entry.btc.price / btcInitialPrice, // BTC as percentage of initial price
      originalPrice: entry.btc.price, // Keep the original price
    },
  }));
};
