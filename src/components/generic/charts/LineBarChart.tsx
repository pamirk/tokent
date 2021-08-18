import React, { useEffect, useMemo, useState } from "react"
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts"

import { hasData, RevenueChartEntry } from "helpers/chartHelpers"
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
import { chartMargin, colors, getByLabel, KeyOption } from "./ChartUtils"
import CustomTooltip from "./tooltip/CustomTooltip"
import { ProjectType } from "types/ApiTypes"
import { debounce, sortBy } from "lodash"
import { useTheme } from "context/ThemeContext"
import { ButtonType } from "./ChartContainer"
import { useData } from "context/DataContext"

const LineBarChart = (props: {
  chartData: RevenueChartEntry[]
  settings: { lineKeys: string[]; barKeys: string[] }
  project?: ProjectType
  buttons: ButtonType[]
}) => {
  const { chartData, settings, project, buttons } = props

  const { mode } = useTheme()
  const { isMobile } = useData()

  const labelColor = mode === "light" ? "#000" : "#FFF"
  const watermark = mode === "light" ? ChartWatermarkGray : ChartWatermarkWhite

  const [activeIndex, setActiveIndex] = useState(-1)

  const [keyOptions, setKeyOptions] = useState<{
    lineKeys: KeyOption[]
    barKeys: KeyOption[]
  }>({ lineKeys: [], barKeys: [] })

  const getColor = (key: string) => {
    if (key === "ps") return colors[6]
    if (key === "pe") return { fill: "#FF0099", stroke: "#FF0099" }
    if (key === "gmv") return colors[2]
    if (key === "tvl") return colors[3]
    if (key.includes("market_cap")) return colors[1]
    if (key === "volume") return { fill: "#CACED0", stroke: "#CACED0" }
    if (key === "token_incentives")
      return { fill: "#EA7650", stroke: "#EA7650" }
    if (key === "price") return { fill: "#73E6FF", stroke: "#73E6FF" }
    return colors[0]
  }

  useEffect(() => {
    const getIsSelected = (key: string) => {
      const lineKeyOption = keyOptions.lineKeys.find(
        (option) => option.key === key
      )
      const barKeyOption = keyOptions.barKeys.find(
        (option) => option.key === key
      )
      if (lineKeyOption) return lineKeyOption.selected
      if (barKeyOption) return barKeyOption.selected
      return true
    }
    const linekeyOptions = settings.lineKeys.map((key: string, i: number) => ({
      key,
      selected: getIsSelected(key),
      color: getColor(key),
    }))
    const barkeyOoptions = settings.barKeys.map((key: string, i: number) => ({
      key,
      selected: getIsSelected(key),
      color: getColor(key),
    }))
    setKeyOptions({ lineKeys: linekeyOptions, barKeys: barkeyOoptions })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  const handleKeySelection = (i: string | number) => {
    const newLineOptions = keyOptions.lineKeys.map((option) =>
      option.key === i ? { ...option, selected: !option.selected } : option
    )
    const newBarOptions = keyOptions.barKeys.map((option) =>
      option.key === i ? { ...option, selected: !option.selected } : option
    )
    setKeyOptions({ barKeys: newBarOptions, lineKeys: newLineOptions })
  }

  let finalData = chartData

  const keys = [...settings.lineKeys, ...settings.barKeys]
  if (
    keys.includes("revenue_protocol") ||
    keys.includes("revenue_supply_side") ||
    keys.includes("token_incentives")
  ) {
    const protocolidx = chartData.findIndex((d) => d.revenue_protocol > 0)
    const supplyidx = chartData.findIndex((d) => d.revenue_supply_side > 0)
    const tokenidx = chartData.findIndex((d) => d.token_incentives > 0)
    finalData = chartData.map((entry, i) => {
      let obj: any = { ...entry }
      if (i < protocolidx) obj["revenue_protocol"] = null
      if (i < supplyidx) obj["revenue_supply_side"] = null
      if (i < tokenidx) obj["token_incentives"] = null
      return obj
    })
  }

  const hasValidData = hasData(
    settings.lineKeys.concat(settings.barKeys),
    finalData
  )

  const handleMouseEnter = useMemo(
    () => debounce((_, index) => setActiveIndex(index), 100),
    []
  )

  if (finalData.length === 0 || !hasValidData) {
    return <ChartLoadingAnimation />
  }

  let barIdx = buttons.findIndex((btn) =>
    settings.barKeys[0]?.includes(btn.name)
  )
  let lineIdx = Math.min(
    ...settings.lineKeys.map((key) =>
      buttons.findIndex((btn) => key.includes(btn.name))
    )
  )
  if (barIdx === -1) barIdx = 99999
  if (lineIdx === -1) lineIdx = 99999

  return (
    <>
      <ResponsiveContainer width="100%" height={isMobile ? 250 : 500}>
        <ComposedChart
          data={finalData}
          margin={chartMargin}
          onMouseLeave={() => setActiveIndex(-1)}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="2 0"
            stroke={mode === "light" ? "#eee" : "#666"}
          />
          {keyOptions.barKeys
            .filter((key) => key.selected)
            .map((option, index) => (
              <YAxis
                label={
                  !isMobile
                    ? {
                        angle: barIdx > lineIdx ? 90 : -90,
                        value: getByLabel(option.key, project),
                        position:
                          barIdx > lineIdx ? "insideRight" : "insideLeft",
                        offset: -20,
                        style: {
                          fontSize: isMobile ? 9 : 12,
                          fill: labelColor,
                          textAnchor: "middle",
                        },
                      }
                    : undefined
                }
                key={option.key + "axis"}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: isMobile ? 9 : 12,
                  fill: mode === "light" ? "unset" : "#FFF",
                }}
                allowDataOverflow={true}
                yAxisId={index}
                orientation={barIdx > lineIdx ? "right" : "left"}
                tickFormatter={(tick:any) => getLabelForChart(tick, option.key)}
                domain={["auto", "auto"]}
                type="number"
              />
            ))}
          {keyOptions.lineKeys
            .filter((key) => key.selected)
            .map((option, index) => (
              <YAxis
                label={
                  !isMobile
                    ? {
                        angle: index === 0 && lineIdx < barIdx ? -90 : 90,
                        value: getByLabel(option.key, project),
                        position:
                          index === 0 && lineIdx < barIdx
                            ? "insideLeft"
                            : "insideRight",
                        offset: -20,
                        style: {
                          fontSize: isMobile ? 9 : 12,
                          fill: labelColor,
                          textAnchor: "middle",
                        },
                      }
                    : undefined
                }
                key={option.key + "axis"}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: isMobile ? 9 : 12,
                  fill: mode === "light" ? "unset" : "#FFF",
                }}
                orientation={index === 0 && lineIdx < barIdx ? "left" : "right"}
                allowDataOverflow={true}
                yAxisId={index + keyOptions.barKeys.length}
                tickFormatter={(tick:any) => getLabelForChart(tick, option.key)}
              />
            ))}
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
          <XAxis
            hide={true}
            xAxisId="fullWidth"
            dataKey="label"
            scale="point"
            tickLine={false}
          />
          {keyOptions.barKeys
            .filter((key) => key.selected)
            .map(
              (option, index) =>
                hasData(option.key, finalData) && (
                  <Bar
                    key={option.key}
                    yAxisId={index}
                    dataKey={option.key}
                    fill={option.color.fill}
                    onMouseEnter={handleMouseEnter}
                  >
                    {finalData.map((entry, index) => (
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
                )
            )}
          {keyOptions.lineKeys
            .filter((key) => key.selected)
            .map(
              (option, index) =>
                hasData(option.key, finalData) && (
                  <Line
                    key={option.key}
                    xAxisId="fullWidth"
                    yAxisId={index + keyOptions.barKeys.length}
                    dataKey={option.key}
                    stroke={option.color.stroke}
                    fill={option.color.fill}
                    strokeWidth="2"
                    activeDot={false}
                    dot={false}
                  />
                )
            )}
          <Tooltip
            cursor={{ fill: "white" }}
            content={<CustomTooltip project={project} />}
          />
          {watermark}
        </ComposedChart>
      </ResponsiveContainer>
      <LegendDiv>
        {sortBy([...keyOptions.lineKeys, ...keyOptions.barKeys], (a) =>
          buttons.findIndex((btn) => a.key.includes(btn.name))
        ).map(
          (option) =>
            hasData(option.key, finalData) && (
              <LegendContainer
                key={option.key}
                onClick={() => handleKeySelection(option.key)}
              >
                <Square
                  fill={option.selected ? option.color.stroke : "#d0cdcd"}
                />
                <LegendText>{getByLabel(option.key, project)}</LegendText>
              </LegendContainer>
            )
        )}
      </LegendDiv>
    </>
  )
}

export default LineBarChart
