import React, { useEffect, useState } from "react"
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts"

import { getLabelForChart } from "helpers/numerals"
import Square from "../icons/Square"
import {
  LegendDiv,
  LegendContainer,
  LegendText,
  ChartWatermarkGray,
  ChartWatermarkWhite,
  ChartLoadingAnimation,
} from "./ChartComponents"
import { chartMargin, colors } from "./ChartUtils"
import CustomTooltip from "./tooltip/CustomTooltip"
import { useTheme } from "context/ThemeContext"
import { useData } from "context/DataContext"

const reversedColors = (keys: string[]) =>
  [...colors].slice(0, keys.length).reverse()

const LineChartComponent = (props: {
  chartData: any[]
  keys: string[]
  metric?: string
}) => {
  const { chartData, keys, metric } = props
  const { mode } = useTheme()
  const { isMobile } = useData()

  const watermark = mode === "light" ? ChartWatermarkGray : ChartWatermarkWhite
  const labelColor = mode === "light" ? "#000" : "#FFF"

  const [keyOptions, setKeyOptions] = useState<
    {
      selected: boolean
      key: string
      color: { fill: string; stroke: string }
    }[]
  >([])

  useEffect(() => {
    const getIsSelected = (key: string | number) => {
      const option = keyOptions.find((option) => option.key === key)
      if (option) return option.selected
      return true
    }

    if (chartData.length === 0) return
    keys.sort(
      (a, b) =>
        chartData[chartData.length - 1][a] - chartData[chartData.length - 1][b]
    )

    if (metric === "ps") {
      keys.reverse()
    }
    if (metric === "ratio") {
      return setKeyOptions([
        { key: "ps", selected: getIsSelected("ps"), color: colors[6] },
        {
          key: "pe",
          selected: getIsSelected("pe"),
          color: { fill: "#FF0099", stroke: "#FF0099" },
        },
      ])
    }

    if (metric === "market_cap") {
      return setKeyOptions([
        {
          key: "market_cap_circulating",
          selected: getIsSelected("market_cap_circulating"),
          color: colors[1],
        },
        {
          key: "market_cap_fully_diluted",
          selected: getIsSelected("market_cap_fully_diluted"),
          color: colors[0],
        },
      ])
    }
    setKeyOptions(
      keys.map((key: string, i: number) => ({
        key,
        selected: getIsSelected(key),
        color: reversedColors(keys)[i],
      }))
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, keys])

  const handleKeySelection = (key: string | number) => {
    const newOptions = keyOptions.map((option) =>
      option.key === key ? { ...option, selected: !option.selected } : option
    )
    setKeyOptions(newOptions)
  }

  let finalData = chartData

  if (metric === "ratio") {
    const psIndex = chartData.findIndex((d) => d.ps > 0)
    const peIndex = chartData.findIndex((d) => d.pe > 0)
    finalData = chartData.map((entry, i) => {
      let obj: any = { ...entry }
      if (i < psIndex) obj["ps"] = null
      if (i < peIndex) obj["pe"] = null
      return obj
    })
  }

  if (finalData.length === 0) {
    return <ChartLoadingAnimation />
  }

  const getByLabel = (label: string | number) => {
    if (label === "marketCap" || label === "market_cap") return "Market cap"
    if (label === "gmv") return "GMV"
    if (label === "tvl") return "TVL"
    if (label === "ps") return "P/S ratio"
    if (label === "pe") return "P/E ratio"
    if (label === "ratio") return "Ratio"
    if (label === "revenueSupplySide") return "Supply-side revenue"
    if (label === "revenueProtocol") return "Protocol revenue"
    if (label === "revenue") return "Revenue"
    if (label === "revenue_protocol") return "Protocol revenue"
    if (label === "revenue_supply_side") return "Supply-side revenue"
    if (label === "market_cap_circulating") return "Circulating market cap"
    if (label === "market_cap_fully_diluted") return "Fully-diluted market cap"

    return label
  }

  return (
    <>
      <ResponsiveContainer height={isMobile ? 250 : 500}>
        <LineChart data={finalData} margin={chartMargin}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="2 0"
            stroke={mode === "light" ? "#eee" : "#666"}
          />
          <XAxis
            tick={{
              fontSize: isMobile ? 9 : 12,
              fill: mode === "light" ? "unset" : "#FFF",
            }}
            dataKey="label"
            allowDataOverflow={true}
          />
          <YAxis
            label={{
              angle: -90,
              value: getByLabel(metric || ""),
              position: "insideLeft",
              offset: -17,
              style: {
                fontSize: isMobile ? 9 : 12,
                fill: labelColor,
                textAnchor: "middle",
              },
            }}
            tick={{
              fontSize: isMobile ? 9 : 12,
              fill: mode === "light" ? "unset" : "#FFF",
            }}
            axisLine={false}
            tickFormatter={(tick:any) => getLabelForChart(tick, metric)}
          />
          <Tooltip cursor={false} content={<CustomTooltip metric={metric} />} />
          {keyOptions
            .filter((option) => option.selected)
            .map((option) => (
              <Line
                activeDot={false}
                dot={false}
                key={option.key}
                dataKey={option.key}
                strokeWidth="2"
                fill={option.color.fill}
                stroke={option.color.stroke}
              />
            ))}
          {watermark}
        </LineChart>
      </ResponsiveContainer>
      <LegendDiv>
        {keyOptions
          .map((option) => (
            <LegendContainer
              key={option.key}
              onClick={() => handleKeySelection(option.key)}
            >
              <Square
                fill={option.selected ? option.color.stroke : "#d0cdcd"}
              />
              <LegendText>{getByLabel(option.key)}</LegendText>
            </LegendContainer>
          ))
          .reverse()}
      </LegendDiv>
    </>
  )
}

export default LineChartComponent
