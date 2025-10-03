
import { QueryGroup, ResultTable, Toaster } from './components'


export const App = () => (
  <>
    <Toaster auto_hide_delay_ms={5_000} />
    <QueryGroup />
    <ResultTable />
    <a
      className=":uno: pos-fixed right-0 bottom-0 h-3rem align-middle line-height-3rem px-2 mr-5 backdrop-blur-sm"
      href="https://simplemaps.com/data/world-cities"
      target="_blank"
      rel="noopener noreferrer"
    >
      data source
    </a>
  </>
)


