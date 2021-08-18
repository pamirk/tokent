import numeral from "numeral"

const TEN = 10
const HUNDRED = TEN * TEN
const THOUSAND = TEN * HUNDRED
const TEN_THOUSAND = TEN * THOUSAND
const HUNDRED_THOUSAND = HUNDRED * THOUSAND
const MILLION = THOUSAND * THOUSAND
const TEN_MILLION = TEN * MILLION
const HUNDRED_MILLION = HUNDRED * MILLION
const BILLION = THOUSAND * MILLION
const TEN_BILLION = TEN * BILLION
const HUNDRED_BILLION = HUNDRED * BILLION
const TRILLION = THOUSAND * BILLION
const TEN_TRILLION = TEN * TRILLION
const HUNDRED_TRILLION = HUNDRED * TRILLION

export const getEqualLengthDecimals = (number: number): string | number => {
  if (!number) return "-"
  if (number < TEN) {
    return numeral(number).format("0.000")
  } else if (number < HUNDRED) {
    return numeral(number).format("0.00")
  } else if (number < THOUSAND) {
    return numeral(number).format("0.0")
  } else if (number < TEN_THOUSAND) {
    return numeral(number).format("0.00a").toUpperCase()
  } else if (number < HUNDRED_THOUSAND) {
    return numeral(number).format("0.0a").toUpperCase()
  } else if (number < MILLION) {
    return numeral(number).format("0a").toUpperCase()
  } else if (number < TEN_MILLION) {
    return numeral(number).format("0.00a").toUpperCase()
  } else if (number < HUNDRED_MILLION) {
    return numeral(number).format("0.0a").toUpperCase()
  } else if (number < BILLION) {
    return numeral(number).format("0a").toUpperCase()
  } else if (number < TEN_BILLION) {
    return numeral(number).format("0.00a").toUpperCase()
  } else if (number < HUNDRED_BILLION) {
    return numeral(number).format("0.0a").toUpperCase()
  } else if (number < TRILLION) {
    return numeral(number).format("0a").toUpperCase()
  } else if (number < TEN_TRILLION) {
    return numeral(number).format("0.00a").toUpperCase()
  } else if (number < HUNDRED_TRILLION) {
    return numeral(number).format("0.0a").toUpperCase()
  }

  return "-"
}

export const revenueChangeDecimals = (revenueChange: number | null) => {
  return numeral(revenueChange).format("0.00%")
}

export const revenueMultiplier = (revenue: number | null) => {
  return numeral(revenue).format("0.0")
}

export default getEqualLengthDecimals

export const getLabelForPrice = (value?: number | null) => {
  if (!value) return "-"
  return "$" + getLabelForNumber(value)
}

export const getLabelForNumber = (value?: number | null) => {
  if (!value || value === -1) return "-"
  return numeral(value).format("0.00a")
}

export const getFullLabelForPrice = (value?: number | null) => {
  if (!!value) return "$" + numeral(value).format("0,0.00")
  return "-"
}
export const getLabelForPercentage = (value?: number | null, csv?: boolean) => {
  if (!value) return csv ? "" : "-"
  const prefill = value > 0 ? "+" : ""
  return prefill + numeral(value).multiply(100.0).format("0,0.00") + "%"
}

export const getLabelForX = (value?: number | null) => {
  if (value === null || value === undefined) return "-"
  return numeral(value).format("0,0.00") + "x"
}

export const getLabelForChart = (value: number | null, label?: string) => {
  if (value === undefined) return "-"
  if (label === "ps" || label === "pe" || label === "ratio")
    return numeral(value).format("0.0a") + "x"
  return "$" + numeral(value).format("0.0a")
}

export const getLabelForTooltip = (value: number | null, label?: string) => {
  if (value === undefined || value === null) return ["-"]
  if (
    label === "ps" ||
    label === "pe" ||
    label?.includes("P/E ratio") ||
    label?.includes("P/S ratio") ||
    label === "ratio"
  )
    return [numeral(value).format("0,0.00") + "x"]

  const rounded = isNaN(parseFloat(numeral(value).format("0.0a")))
    ? 0
    : numeral(value).format("0.0a")

  return ["$" + numeral(value).format("0,0.00"), "≈ $" + rounded]
}

export const getChartLabel = (value: number | null, label?: string) => {
  if (value === undefined || value === null) return ["-"]
  if (label === "ps" || label === "pe")
    return [numeral(value).format("0.0a") + "x"]

  const rounded = isNaN(parseFloat(numeral(value).format("0.0a")))
    ? 0
    : numeral(value).format("0.0a")

  return ["$" + rounded]
}

export type ColorStyle = { color: string }

export const getColor = (percentage?: number | null): ColorStyle => {
  if (!percentage) return { color: "unset" }
  if (percentage >= 0) {
    return { color: "#00CF9D" }
  }
  return { color: "#EB5858" }
}

export const getPercentageStrColor = (value: string) => {
  if (!value) return ""
  try {
    const parsed = parseFloat(value.replace(/(\d+%)/, "")) / 100

    if (parsed >= 0) return "54AC95"
    if (parsed < 0) return "DC3A26"
  } catch {
    return "unset"
  }
}

export const getLabelForMasterCSV = (value?: number | null) => {
  if (value === undefined || value === null) return undefined
  return numeral(value).format("0.00")
}

export const reverseNumeral = (value?: number | null) => {
  if (!!value) {
    return value * -1
  }

  return 0
}
