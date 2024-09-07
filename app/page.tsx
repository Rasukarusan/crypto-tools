import { Graph } from './components/Graph'

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-blue-700 font-bold text-3xl mb-8 text-center">
        Hello, Crypt!
      </h1>
      <Graph />
    </div>
  )
}
