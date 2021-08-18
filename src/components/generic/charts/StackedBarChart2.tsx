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
import CustomTooltip from "./tooltip/CustomTooltip"
import { debounce } from "lodash"
import { useTheme } from "context/ThemeContext"
import { chartMargin, toPercent } from "./ChartUtils"
import { useData } from "context/DataContext"

type SettingType = { key: string; color: { fill: string; stroke: string } }
const StackedBarChart = (props: {
  chartData: any
  settings: SettingType[]
  tooltip?: any
  label?: string
  isPercentageShareOn?: boolean
}) => {
  const { mode } = useTheme()
  const { isMobile } = useData()
  const labelColor = mode === "light" ? "#000" : "#FFF"
  const watermark = mode === "light" ? ChartWatermarkGray : ChartWatermarkWhite

  const { chartData, settings, label, tooltip, isPercentageShareOn } = props

  const [activeIndex, setActiveIndex] = useState(-1)
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
      settings.map((setting: SettingType) => ({
        key: setting.key,
        selected: getIsSelected(setting.key),
        color: setting.color,
      }))
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  const handleKeySelection = (i: string | number) => {
    const newOptions = keyOptions.map((option) =>
      option.key === i ? { ...option, selected: !option.selected } : option
    )
    setKeyOptions(newOptions)
  }

  const handleMouseEnter = useMemo(
    () => debounce((_, index) => setActiveIndex(index), 100),
    []
  )

  if (chartData.length === 0 || settings.length === 0) {
    return <ChartLoadingAnimation />
  }

  const getByLabel = (label: string) => {
    if (label === "marketCap" || label === "market_cap") return "Market cap"
    if (label === "gmv") return "GMV"
    if (label === "tvl") return "TVL"
    if (label === "revenue_supply_side") return "Supply-side revenue"
    if (label === "revenue_protocol") return "Protocol revenue"
    return "Revenue"
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
              value: label,
              position: "insideLeft",
              offset: -17,
              style: {
                fontSize: isMobile ? 9 : 12,
                fill: labelColor,
                textAnchor: "middle",
              },
            }}
            axisLine={false}
            tick={{
              fontSize: isMobile ? 9 : 12,
              fill: mode === "light" ? "unset" : "#FFF",
            }}
            tickFormatter={(tick:any) =>
              isPercentageShareOn ? toPercent(tick) : getLabelForChart(tick)
            }
          />
          <Tooltip
            content={
              tooltip || (
                <CustomTooltip isPercentageShareOn={isPercentageShareOn} />
              )
            }
            cursor={false}
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
                {chartData.map((entry: any, index: number) => (
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
