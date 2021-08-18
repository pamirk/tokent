import React, { useMemo, useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
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
import { debounce } from "lodash"
import { useTheme } from "context/ThemeContext"
import { useData } from "context/DataContext"

const StackedBarChart = (props: {
  chartData: any[]
  keys: string[]
  label?: string
  isPercentageShareOn?: boolean
}) => {
  const { chartData, keys, label, isPercentageShareOn } = props
  const { mode } = useTheme()
  const { isMobile } = useData()
  const labelColor = mode === "light" ? "#000" : "#FFF"
  const watermark = mode === "light" ? ChartWatermarkGray : ChartWatermarkWhite

  const [activeIndex, setActiveIndex] = useState(-1)
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

    setKeyOptions(
      keys.map((key: string, i: number) => ({
        key,
        selected: getIsSelected(key),
        color: colors[i],
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

  const handleMouseEnter = useMemo(
    () => debounce((_, index) => setActiveIndex(index), 100),
    []
  )

  const getByLabel = (label: string | number) => {
    if (label === "marketCap" || label === "market_cap") return "Market cap"
    if (label === "gmv") return "GMV"
    if (label === "tvl") return "TVL"
    if (label === "revenueSupplySide") return "Supply-side revenue"
    if (label === "revenueProtocol") return "Protocol revenue"
    if (label === "revenue") return "Revenue"
    return label
  }

  if (chartData.length === 0) {
    return <ChartLoadingAnimation />
  }

  return (
    <>
      <ResponsiveContainer height={isMobile ? 250 : 500}>
        <BarChart
          data={chartData}
          margin={chartMargin}
          onMouseLeave={() => setActiveIndex(-1)}
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
            allowDataOverflow={true}
          />
          <YAxis
            label={{
              angle: -90,
              value: getByLabel(label || ""),
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
            tickFormatter={(tick:any) =>
              isPercentageShareOn ? toPercent(tick) : getLabelForChart(tick)
            }
          />
          <Tooltip
            cursor={false}
            content={
              <CustomTooltip isPercentageShareOn={isPercentageShareOn} />
            }
          />
          {keyOptions
            .filter((option) => option.selected)
            .reverse()
            .map((option) => (
              <Bar
                key={option.key}
                stackId="a"
                dataKey={option.key}
                fill={option.color.fill}
                onMouseEnter={handleMouseEnter}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    fill={
                      index === activeIndex
                        ? option.color.stroke
                        : option.color.fill
                    }
                    key={`cell-${index}`}
                  />
                ))}
              </Bar>
            ))}
          {watermark}
        </BarChart>
      </ResponsiveContainer>
      <LegendDiv>
        {keyOptions.map((option) => (
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

export default StackedBarChart
