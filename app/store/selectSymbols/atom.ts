import { atom } from "jotai";

export type SelectSymbols = {
  value: string;
  label: string;
}[];

export const selectSymbolsAtom = atom<SelectSymbols>([
  { label: "BTCUSDT", value: "BTCUSDT" },
  { label: "SUIUSDT", value: "SUIUSDT" },
]);
