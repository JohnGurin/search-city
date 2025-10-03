
import { QueryGroup, ResultTable, Toaster } from './components'


export const App = () => (
  <>
    <Toaster auto_hide_delay_ms={5_000} />
    <QueryGroup />
    <ResultTable />
  </>
)


