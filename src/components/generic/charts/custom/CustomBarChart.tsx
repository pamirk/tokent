import React, { useMemo, useState } from "react"
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
import { debounce } from "lodash"
import { useTheme } from "context/ThemeContext"
import { isMobile } from "helpers/generic"
import { chartMargin, colors, getByLabel, KeyOption } from "../ChartUtils"
import {
  ChartLoadingAnimation,
  ChartWatermarkGray,
  ChartWatermarkWhite,
  LegendContainer,
  LegendDiv,
  LegendText,
} from "../ChartComponents"
import CustomTooltip from "../tooltip/CustomTooltip"
import { useEffect } from "react"
import Square from "components/generic/icons/Square"

const CustomBarChart = (props: {
  chartData: any[]
  keys: string[]
  metric: string
}) => {
  const { chartData, keys, metric } = props
  const [activeIndex, setActiveIndex] = useState(-1)

  const [keyOptions, setKeyOptions] = useState<KeyOption[]>([])
  const { mode } = useTheme()

  const handleKeySelection = (i: string | number) => {
    const newOptions = keyOptions.map((option) =>
      option.key === i ? { ...option, selected: !option.selected } : option
    )
    setKeyOptions(newOptions)
  }

  useEffect(() => {
    setKeyOptions(
      keys.map((key, i) => ({ key, color: colors[i], selected: true }))
    )
  }, [keys])

  const labelColor = mode === "light" ? "#000" : "#FFF"
  const watermark = mode === "light" ? ChartWatermarkGray : ChartWatermarkWhite

  const handleMouseEnter = useMemo(
    () => debounce((_, index) => setActiveIndex(index), 20),
    []
  )

  if (chartData.length === 0) {
    return <ChartLoadingAnimation />
  }

  return (
    <>
      <ResponsiveContainer height={isMobile ? 250 : 500}>
        <BarChart
          barGap={0}
          margin={{ ...chartMargin, left: isMobile ? 0 : 50 }}
          data={chartData}
          onMouseLeave={() => setActiveIndex(-1)}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="2 0"
            stroke={mode === "light" ? "#eee" : "#666"}
          />
          <XAxis
            tickLine={false}
            dataKey="label"
            tick={{
              fontSize: isMobile ? 9 : 12,
              fill: mode === "light" ? "unset" : "#FFF",
            }}
            allowDataOverflow={true}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis
            label={
              !isMobile
                ? {
                    angle: -90,
                    value: getByLabel(metric),
                    position: "insideLeft",
                    offset: -30,
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
            tickFormatter={(tick) => getLabelForChart(tick, metric)}
          />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          {keyOptions
            .filter((k) => k.selected)
            .map((option, i) => (
              <Bar
                key={option.key}
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

export default CustomBarChart
