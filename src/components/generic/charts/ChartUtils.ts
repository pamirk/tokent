import { timeSince } from "helpers/date"
import { isMobile } from "helpers/generic"
import { sortBy } from "lodash"
import { ProjectType } from "types/ApiTypes"

export const colors = [
  { fill: "#6FECCE", stroke: "#63d4b8" },
  { fill: "#4d38ff", stroke: "#4432e6" },
  { fill: "#FF7AB2", stroke: "#e66e9e" },
  { fill: "#FEDF1D", stroke: "#e6ca19" },
  { fill: "#8C81FE", stroke: "#7e75e6" },
  { fill: "#C8A67B", stroke: "#ad926c" },
  { fill: "#BBBDBE", stroke: "#a2a4a6" },
  { fill: "#FA6523", stroke: "#e05a1f" },
  { fill: "#D0DE7D", stroke: "#b9c46e" },
  { fill: "#F37675", stroke: "#d96868" },
  { fill: "#FF0099", stroke: "#FF0099" },
  { fill: "#CACED0", stroke: "#CACED0" },
  { fill: "#EA7650", stroke: "#EA7650" },
  { fill: "#73E6FF", stroke: "#73E6FF" },
]

export const getByLabel = (label: string, project?: ProjectType) => {
  if (label === "marketCap" || label === "market_cap") return "Market cap"
  if (label === "market_cap_fully_diluted") return "Fully-diluted market cap"
  if (label === "market_cap_circulating") return "Circulating market cap"
  if (label === "ps") return "P/S ratio"
  if (label === "pe") return "P/E ratio"
  if (label === "price") return "Price"
  if (label === "rattio") return "Ratio"
  if (label === "price") return "Price"
  if (label === "volume") return `${project?.symbol || "Token"} trading volume`
  if (label === "vol_mc") return "VOL/MC"
  if (label === "tvl") return "TVL"
  if (label === "revenue_supply_side") return "Supply-side revenue"
  if (label === "revenue_protocol" || label === "revenue_protocol")
    return "Protocol revenue"
  if (label === "revenue") return "Total revenue"
  if (label === "revenue-multi") return "Revenue"
  if (label === "token_incentives") return "Token incentives"

  if (label === "gmv") {
    if (project?.category_tags.includes("Lending")) {
      return "Borrowing volume"
    } else if (
      project?.category_tags.includes("Exchange") ||
      project?.category_tags.includes("Prediction Market")
    ) {
      return "Trading volume"
    } else if (project?.category_tags.includes("Asset Management")) {
      return "Capital deployed"
    }
    return "Transaction volume"
  }
  return label
}

export const keysToNotInclude = [
  "label",
  "tooltipLabel",
  "category",
  "datetime",
]

export const chartMargin = isMobile
  ? { top: 20, right: 0, bottom: 10, left: 0 }
  : { top: 20, right: 25, bottom: 10, left: 25 }

export const getLastUpdated = (chartData: any[]) => {
  const last = chartData[chartData.length - 1]

  if (last && last.datetime) {
    return "Last updated: " + timeSince(new Date(last.datetime)) + " ago"
  }
}

export const getTopXKeys = (
  chartData: any[],
  amount: number,
  reverse?: boolean
) => {
  const keys = getChartKeys(chartData)

  let weekSum: any = chartData[0]
  if (chartData.length > 7) {
    weekSum = chartData
      .slice(chartData.length - 7, chartData.length - 1)
      .reduce((obj, entry) => {
        keys.forEach((key) =>
          obj[key]
            ? (obj[key] += entry[key] || 0)
            : (obj[key] = entry[key] || 0)
        )
        return obj
      }, {})
  }

  const sortedKeys = sortBy(keys, (key) => weekSum[key])

  if (reverse) {
    return sortedKeys.slice(0, amount)
  }

  return sortedKeys.reverse().slice(0, amount)
}

export const getChartKeys = (chartData: any[]) => {
  return Array.from(new Set(chartData.flatMap((x) => Object.keys(x)))).filter(
    (key) => !keysToNotInclude.includes(key)
  )
}

export const toPercent = (decimal: number, fixed = 0) =>
  `${(decimal * 100).toFixed(fixed)}%`

export const getPercent = (value: number, total: number) => {
  const ratio = total > 0 ? value / total : 0

  return toPercent(ratio, 2)
}

export type KeyOption = {
  selected: boolean
  key: string
  color: { fill: string; stroke: string }
}
