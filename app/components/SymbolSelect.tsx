import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { type SelectSymbol, selectSymbolAtom } from '../store/selectSymbol/atom'
const Select = dynamic(() => import('react-select'), { ssr: false })

export const SymbolSelect: React.FC = () => {
  const [options, setOptions] = useState([])
  const [selectSymbol, setSelectSymbol] = useAtom(selectSymbolAtom)

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
        defaultValue={selectSymbol}
        onChange={(e: SelectSymbol[]) => {
          setSelectSymbol(e)
        }}
      />
    </div>
  )
}
