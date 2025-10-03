// https://simplemaps.com/data/world-cities
import readline from 'node:readline/promises'
import fs from 'node:fs'


const INPUT_FILEPATH = 'src-data/simplemaps_worldcities_basicv1.901.csv'
const OUTPUT_FILEPATH = 'src/worker/data.ts'

const id = <T>(x: T) => x
const column_cfg = {
  city_ascii: id,
  lat: Number,
  lng: Number,
  country: id,
  population: Number,
  id: Number,
}

const vals_from_line
  = (line: string) => line
    .substring(1, line.length - 1)
    .split('","')
    .map(x => x.trim())

async function processLineByLine(filepath: string) {
  const fileStream = fs.createReadStream(filepath)

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })[Symbol.asyncIterator]()

  const r = await rl.next()
  if (r.value === undefined)
    process.exit(1)

  const columns = vals_from_line(r.value)
    .map((col, idx) => [col, idx] as const)
    .filter(([col]) => column_cfg[col as keyof typeof column_cfg] !== undefined)
  const country_column_idx = columns.find(([col]) => col === 'country')![1]
  const columns_idx = columns.map(p => p[1])
  const columns_parser = Object.values(column_cfg)

  let country_id = 0
  const countries: { [k: string]: number } = {}
  push(
    '/* eslint-disable */\n'
    + '/* @ts-ignore */\n'
    + 'export const rows: [string, number, number, number, number, number][] = [\n',
  )
  for await (const line of rl) {
    const vals: (string | number)[] = vals_from_line(line)
    const country = vals[country_column_idx]
    if (countries[country] === undefined)
      countries[country] = country_id++
    vals[country_column_idx] = countries[country]

    const row = new Array<string | number>(columns.length)
    for (let i = 0; i < columns_idx.length; ++i) {
      const p = columns_parser[i]
      const val = vals[columns_idx[i]]
      row[i] = p ? p(val) : val
    }
    push(JSON.stringify(row) + ',\n')
  }

  push(']\nexport const countries = [\n')
  for (const [c] of Object.entries(countries))
    push(`"${c}",\n`)
  push(']\n')
}

const fileOut = fs.createWriteStream(OUTPUT_FILEPATH, { flags: 'w' })
const push = fileOut.write.bind(fileOut)

await processLineByLine(INPUT_FILEPATH)
