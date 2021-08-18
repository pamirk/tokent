import React, { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
import { chartMargin, colors, toPercent } from "./ChartUtils"
import CustomTooltip from "./tooltip/CustomTooltip"
import { useTheme } from "context/ThemeContext"
import { useData } from "context/DataContext"

const StackedAreaChart = (props: {
  data: any[]
  settings: (string | number)[]
  label?: string
  isPercentageShareOn?: boolean
}) => {
  const { mode } = useTheme()
  const { isMobile } = useData()

  const labelColor = mode === "light" ? "#000" : "#FFF"
  const watermark = mode === "light" ? ChartWatermarkGray : ChartWatermarkWhite

  const { data, settings, label, isPercentageShareOn } = props

  const [keyOptions, setKeyOptions] = useState<
    {
      selected: boolean
      key: string | number
      color: { fill: string; stroke: string }
    }[]
  >([])

  // sort keys by values in last entry on chart data and reverse colors to have green on top
  settings.sort((a, b) => data[data.length - 1][a] - data[data.length - 1][b])

  useEffect(() => {
    const getIsSelected = (key: string | number) => {
      const option = keyOptions.find((option) => option.key === key)
      if (option) return option.selected
      return true
    }

    setKeyOptions(
      settings
        .reverse()
        .map((key: string | number, i: number) => ({
          key,
          selected: getIsSelected(key),
          color: colors[i],
        }))
        .reverse()
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  const handleKeySelection = (key: string | number) => {
    const newOptions = keyOptions.map((option) =>
      option.key === key ? { ...option, selected: !option.selected } : option
    )
    setKeyOptions(newOptions)
  }

  const getByLabel = (label: string | number) => {
    if (label === "marketCap" || label === "market_cap") return "Market cap"
    if (label === "gmv") return "GMV"
    if (label === "tvl") return "TVL"
    if (label === "revenueSupplySide") return "Supply-side revenue"
    if (label === "revenueProtocol") return "Protocol revenue"
    if (label === "revenue") return "Total revenue"
    return label
  }

  if (data.length === 0 || settings.length === 0) {
    return <ChartLoadingAnimation />
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={isMobile ? 250 : 500}>
        <AreaChart
          data={data}
          margin={chartMargin}
          stackOffset={isPercentageShareOn ? "expand" : "none"}
        >
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
          />
          <YAxis
            label={{
              angle: -90,
              value: getByLabel(label || ""),
              offset: -17,
              position: "insideLeft",
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
            tickFormatter={(tick:any) =>
              isPercentageShareOn ? toPercent(tick) : getLabelForChart(tick)
            }
          />
          <Tooltip
            content={
              <CustomTooltip isPercentageShareOn={isPercentageShareOn} />
            }
            cursor={{ fill: "transparent" }}
          />
          {keyOptions
            .filter((key) => key.selected)
            .map((option) => (
              <Area
                key={option.key}
                stackId="1"
                dataKey={option.key}
                fill={option.color.fill}
                stroke={option.color.stroke}
              />
            ))}
          {watermark}
        </AreaChart>
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

export default StackedAreaChart
