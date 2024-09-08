import { atom } from "jotai";

export interface SelectSymbol {
  value: string;
  label: string;
}
export const selectSymbolAtom = atom<SelectSymbol[]>([
  { label: "SUIUSDT", value: "SUIUSDT" },
  { label: "BTCUSDT", value: "BTCUSDT" },
]);
