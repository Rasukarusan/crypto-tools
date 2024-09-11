import { useAsyncEffect } from 'ahooks'
import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { searchParamsAtom } from '../store/searchParams/atom'

const Select = dynamic(() => import('react-select'), { ssr: false })

interface SelectedSymbol {
  label: string
  value: string
}

export const SymbolSelect = () => {
  const [options, setOptions] = useState([])
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom)

  useAsyncEffect(async () => {
    const res = await fetch('/api/binance/symbols').then((res) => res.json())
    if (!res.result) {
      setOptions([])
      return
    }
    const newOptions = res.symbols.map((v) => ({ value: v, label: v }))
    setOptions(newOptions)
  }, [])
  return (
    <div>
      <Select
        options={options}
        isMulti={true}
        defaultValue={searchParams.symbols
          .split(',')
          .map((symbol) => ({ label: symbol, value: symbol }))}
        onChange={(e: SelectedSymbol[]) => {
          setSearchParams({
            ...searchParams,
            symbols: e.map((symbol) => symbol.value).join(','),
          })
        }}
      />
    </div>
  )
}
