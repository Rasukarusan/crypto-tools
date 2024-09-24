import { Graph } from './components/Graph'
import { USAMarkets } from './components/USAMarkets'

export default function Page() {
  return (
    <div className="p-2 sm:p-8">
      <h1 className="text-blue-700 font-bold text-3xl mb-8 text-center">
        Hi, Crypt!
      </h1>
      <div className="mb-24">
        <Graph />
      </div>
      <USAMarkets />
    </div>
  )
}
