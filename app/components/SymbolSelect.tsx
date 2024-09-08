import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import {
  type SelectSymbols,
  selectSymbolsAtom,
} from '../store/selectSymbols/atom'
const Select = dynamic(() => import('react-select'), { ssr: false })

export const SymbolSelect: React.FC = () => {
  const [options, setOptions] = useState([])
  const [selectSymbols, setSelectSymbols] = useAtom(selectSymbolsAtom)

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/binance/symbols').then((res) => res.json())
      if (!res.result) {
        return []
      }
      const newOptions = res.symbols.map((v) => ({ value: v, label: v }))
      setOptions(newOptions)
    })()
  }, [])
  return (
    <div>
      <Select
        options={options}
        isMulti={true}
        defaultValue={selectSymbols}
        onChange={(e: SelectSymbols[]) => {
          setSelectSymbols(e)
        }}
      />
    </div>
  )
}
