import React, { useCallback, useState } from "react"
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Bar,
  Cell,
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
import { chartMargin, colors, getByLabel } from "./ChartUtils"
import CustomTooltip from "./tooltip/CustomTooltip"
import { useTheme } from "context/ThemeContext"
import { useData } from "context/DataContext"
import { SettingsType } from "components/terminal/project/Custom"
import { useEffect } from "react"

const CustomChart = (props: {
  data: RevenueChartEntry[]
  keys: string[]
  settings1: SettingsType
  settings2: SettingsType
}) => {
  const { data, keys, settings1, settings2 } = props

  const { mode } = useTheme()
  const { isMobile } = useData()

  const [selected, setSelected] = useState<{ [key: number]: boolean }>({})

  const getSettings = useCallback(() => {
    let results: {
      index: number
      stackId: string
      key: string
      type: string
      stacked: boolean
    }[] = []

    if (settings1.metric) {
      results = settings1.projects.map((entry, i) => ({
        index: i,
        stackId: "settings1",
        key: settings1.metric?.name + "-" + entry.project.name,
        type: settings1.type,
        stacked: settings1.stacked,
      }))
    }

    if (settings2.metric) {
      const a = settings2.projects.map((entry, i) => ({
        index: i + results.length,
        stackId: "settings2",
        key: settings2.metric?.name + "-" + entry.project.name,
        type: settings2.type,
        stacked: settings2.stacked,
      }))
      results = [...results, ...a]
    }

    return results
  }, [settings1, settings2])

  useEffect(() => {
    const defaultSelected = getSettings().reduce(
      (obj, entry) => ({ ...obj, [entry.index]: true }),
      {}
    )
    setSelected(defaultSelected)
  }, [getSettings, keys])

  const labelColor = mode === "light" ? "#000" : "#FFF"
  const watermark = mode === "light" ? ChartWatermarkGray : ChartWatermarkWhite

  const hasValidData = hasData(keys, data)

  if (data.length === 0 || !hasValidData) {
    return <ChartLoadingAnimation />
  }

  const yaxisKeys = () => {
    let result: string[] = []
    if (
      settings1.metric?.name &&
      settings2.metric?.name &&
      settings1.metric?.name === settings2.metric?.name
    ) {
      return [settings1.metric.name]
    }

    if (settings1.metric?.name) {
      result = [settings1.metric.name]
    }
    if (settings2.metric?.name) {
      result = [...result, settings2.metric.name]
    }

    return result
  }

  const allSettings = getSettings()

  const areaKeys = allSettings.filter((setting) => setting.type === "area")
  const barKeys = allSettings.filter((setting) => setting.type === "bar")
  const lineKeys = allSettings.filter((setting) => setting.type === "line")

  return (
    <>
      <ResponsiveContainer width="100%" height={isMobile ? 250 : 500}>
        <ComposedChart data={data} margin={chartMargin}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="2 0"
            stroke={mode === "light" ? "#eee" : "#666"}
          />
          {yaxisKeys().map((key, index) => (
            <YAxis
              label={
                !isMobile
                  ? {
                      angle: index === 0 ? -90 : 90,
                      value: getByLabel(key.split("-")[0]),
                      position: index === 0 ? "insideLeft" : "insideRight",
                      offset: -20,
                      style: {
                        fontSize: isMobile ? 9 : 12,
                        fill: labelColor,
                        textAnchor: "middle",
                      },
                    }
                  : undefined
              }
              key={key}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: isMobile ? 9 : 12,
                fill: mode === "light" ? "unset" : "#FFF",
              }}
              allowDataOverflow={true}
              yAxisId={key}
              orientation={index === 0 ? "left" : "right"}
              tickFormatter={(tick) =>
                getLabelForChart(tick, key.split("-")[0])
              }
              domain={["auto", "auto"]}
              type="number"
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
          {barKeys
            .filter(({ key, index }) => selected[index])
            .map(
              ({ stackId, key, stacked, index }) =>
                hasData(key, data) && (
                  <Bar
                    stackId={stacked ? stackId : undefined}
                    key={key + index}
                    yAxisId={key.split("-")[0]}
                    dataKey={key}
                    name={
                      key.split("-")[1] + " " + getByLabel(key.split("-")[0])
                    }
                    stroke={colors[index].stroke}
                    fill={colors[index].fill}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Bar>
                )
            )}
          {lineKeys
            .filter(({ key, index }) => selected[index])
            .map(
              ({ key, index }) =>
                hasData(key, data) && (
                  <Line
                    key={key + index}
                    yAxisId={key.split("-")[0]}
                    dataKey={key}
                    name={
                      key.split("-")[1] + " " + getByLabel(key.split("-")[0])
                    }
                    strokeWidth="2"
                    activeDot={true}
                    dot={false}
                    stroke={colors[index].stroke}
                    fill={colors[index].fill}
                  />
                )
            )}
          {areaKeys
            .filter(({ key, index }) => selected[index])
            .map(
              ({ stackId, key, stacked, index }) =>
                hasData(key, data) && (
                  <Area
                    key={key + index}
                    stackId={stacked ? stackId : undefined}
                    yAxisId={key.split("-")[0]}
                    dataKey={key}
                    name={
                      key.split("-")[1] + " " + getByLabel(key.split("-")[0])
                    }
                    stroke={colors[index].stroke}
                    fill={colors[index].fill}
                  />
                )
            )}
          <Tooltip cursor={{ fill: "white" }} content={<CustomTooltip />} />
          {watermark}
        </ComposedChart>
      </ResponsiveContainer>
      <LegendDiv>
        {allSettings.map(
          ({ key, index }) =>
            hasData(key, data) && (
              <LegendContainer
                key={key + index}
                onClick={() =>
                  setSelected({ ...selected, [index]: !selected[index] })
                }
              >
                <Square
                  fill={selected[index] ? colors[index].stroke : "#d0cdcd"}
                />
                <LegendText>
                  {getByLabel(
                    key.split("-")[1] + " " + getByLabel(key.split("-")[0])
                  )}
                </LegendText>
              </LegendContainer>
            )
        )}
      </LegendDiv>
    </>
  )
}

export default CustomChart
