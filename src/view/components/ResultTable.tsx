import { state } from '#/init'
import type { FetchedData } from '#/model/model'
import { useSubscribe } from '#/view/useSubscribe'


const ZOOM = 8

const map_href = (lat: number, lon: number) =>
  'https://www.openstreetmap.org/?'
  + `mlat=${lat}&mlon=${lon}`
  + `#map=${ZOOM}/${lat}/${lon}`

const commafy = (num: number) => {
  const int = `${Math.abs(num) | 0}`
  let out = '', len, i = len = int.length
  while (--i) out = ((len - i) % 3 ? '' : ',') + int.charAt(i) + out
  return (num < 0 ? '-' : '') + int.charAt(0) + out
}

const row = ({ id, vals }: FetchedData[0]) => (
  <a
    className={String.raw`:uno:
      table-row bg-white border-b border-gray-200
      dark:bg-gray-800 dark:border-gray-700
    `}
    href={map_href(vals.lat, vals.lon)}
    target="_blank"
    rel="noopener noreferrer"
    key={id}
  >
    <div className="px-6 py-3 table-cell">{vals.city}</div>
    <div className="px-6 py-4 table-cell text-center">{vals.state}</div>
    <div className="px-6 py-4 table-cell text-right">{commafy(vals.pop)}</div>
    <div className="px-6 py-4 table-cell w-1">
      <svg
        className="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4
             18.833V7.167A1.166 1.166 0 0 1 5.167
             6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
        />
      </svg>
    </div>
  </a>
)

const Tbody = () => useSubscribe(state.fetched).map(row)
const Thead = () => (
  <div className={String.raw`:uno:
    table-header-group text-xs text-gray-700 uppercase bg-gray-50
    dark:bg-gray-700 dark:text-gray-400
  `}
  >
    <div className="table-row">
      <div className="table-cell px-6 py-3">City</div>
      <div className="table-cell px-6 py-3 text-center">Country</div>
      <div className="table-cell px-6 py-3 text-right">Population</div>
      <div className="table-cell px-6 py-3 w-1"></div>
    </div>
  </div>
)

export const ResultTable = () => (
  <div
    className={String.raw`:uno:
      table w-full relative overflow-x-auto mt-1rem
      table-fixed w-full text-sm text-left
      text-gray-500 dark:text-gray-400
    `}
  >
    <Thead />
    <Tbody />
  </div>
)


