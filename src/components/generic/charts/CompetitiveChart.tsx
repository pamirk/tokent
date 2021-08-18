import React, { useEffect, useState } from "react"
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { getLabelForChart } from "helpers/numerals"
import Square from "../icons/Square"
import {
  NoDataDiv,
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

const CompetitiveChart = (props: {
  data: any[]
  keys: string[]
  metric: string
}) => {
  const { isMobile } = useData()
  const { mode } = useTheme()

  const { data, keys, metric } = props

  const labelColor = mode === "light" ? "#000" : "#FFF"
  const watermark = mode === "light" ? ChartWatermarkGray : ChartWatermarkWhite

  const [keyOptions, setKeyOptions] = useState<
    {
      selected: boolean
      key: string
      color: { fill: string; stroke: string }
    }[]
  >([])

  useEffect(() => {
    const getIsSelected = (key: string) => {
      const option = keyOptions.find((option) => option.key === key)
      if (option) return option.selected
      return true
    }

    setKeyOptions(
      keys.map((key: string, i: number) => ({
        key,
        selected: getIsSelected(key),
        color: colors[i],
      }))
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys])

  if (keys.length === 0) {
    return (
      <NoDataDiv>{"Select a project / projects to render a chart."}</NoDataDiv>
    )
  }

  if (data.length === 0) {
    return <ChartLoadingAnimation />
  }

  const getByLabel = (label: string | number) => {
    if (label === "marketCap" || label === "market_cap") return "Market cap"
    if (label === "market_cap_fully_diluted") return "Fully-diluted market cap"
    if (label === "market_cap_circulating") return "Circulating market cap"
    if (label === "gmv") return "GMV"
    if (label === "tvl") return "TVL"
    if (label === "revenue_supply_side") return "Supply-side revenue"
    if (label === "revenue_protocol") return "Protocol revenue"
    if (label === "revenue") return "Total revenue"
    if (label === "ps") return "P/S ratio"
    if (label === "pe") return "P/E ratio"
    if (label === "volume") return "Token trading volume"
    return label
  }

  const handleKeySelection = (key: string | number) => {
    const newOptions = keyOptions.map((option) =>
      option.key === key ? { ...option, selected: !option.selected } : option
    )
    setKeyOptions(newOptions)
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={isMobile ? 250 : 500}>
        <ComposedChart data={data} margin={chartMargin}>
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
            label={
              !isMobile
                ? {
                    angle: -90,
                    value: getByLabel(metric),
                    position: "insideLeft",
                    offset: -20,
                    style: {
                      fontSize: isMobile ? 9 : 12,
                      fill: labelColor,
                      textAnchor: "middle",
                    },
                  }
                : undefined
            }
            tick={{
              fontSize: isMobile ? 9 : 12,
              fill: mode === "light" ? "unset" : "#FFF",
            }}
            axisLine={false}
            tickFormatter={(tick:any) => getLabelForChart(tick, metric)}
          />
          <Tooltip content={<CustomTooltip metric={metric} />} />

          {keyOptions
            .filter((key) => key.selected)
            .map((option, i) => (
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
        </ComposedChart>
      </ResponsiveContainer>
      <LegendDiv>
        {keyOptions.map((option, i) => (
          <LegendContainer
            key={option.key}
            onClick={() => handleKeySelection(option.key)}
          >
            <Square fill={option.selected ? option.color.stroke : "#d0cdcd"} />
            <LegendText>{getByLabel(option.key)}</LegendText>
          </LegendContainer>
        ))}
      </LegendDiv>
    </>
  )
}

export default CompetitiveChart
