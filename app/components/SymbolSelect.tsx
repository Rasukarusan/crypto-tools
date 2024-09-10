import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { searchParamsAtom } from '../store/searchParams/atom'
import type { SelectSymbols } from '../store/selectSymbols/atom'

const Select = dynamic(() => import('react-select'), { ssr: false })

export const SymbolSelect: React.FC = () => {
  const [options, setOptions] = useState([])
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom)

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
        defaultValue={searchParams.symbols
          .split(',')
          .map((symbol) => ({ label: symbol, value: symbol }))}
        onChange={(e: SelectSymbols) => {
          setSearchParams({
            ...searchParams,
            symbols: e.map((symbol) => symbol.value).join(','),
          })
        }}
      />
    </div>
  )
}
