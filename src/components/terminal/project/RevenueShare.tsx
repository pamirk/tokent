import React, { useEffect, useMemo, useState } from "react"

import { ProjectMetricsType, ProjectType } from "types/ApiTypes"
import ChartContainer, {
  ButtonType,
} from "components/generic/charts/ChartContainer"
import { labelProjectDefaultData, cleanChartData } from "helpers/chartHelpers"
import {
  fetchDailyProjectMetrics,
  fetchMonthlyProjectMetrics,
} from "api/ApiCalls"
import StackedBarChart from "components/generic/charts/StackedBarChart2"
import RevenueSplitTooltip from "components/generic/charts/tooltip/RevenueShareTooltip"
import { colors } from "components/generic/charts/ChartUtils"

type SettingType = { key: string; color: { fill: string; stroke: string } }

type Props = {
  defaultProjectMetrics: ProjectMetricsType
  dailyProjectMetrics: ProjectMetricsType
  monthlyProjectMetrics: ProjectMetricsType
  setProjectMetrics: (interval: string, data: ProjectMetricsType) => void
  project: ProjectType
}

const initialButtons = [
  {
    title: "Supply-side",
    name: "revenue_supply_side",
    selected: true,
    tooltipId: "revenue-supplyside",
  },
  {
    title: "Protocol",
    name: "revenue_protocol",
    selected: true,
    tooltipId: "revenue-protocol",
  },
]

const RevenueShare = (props: Props) => {
  const {
    defaultProjectMetrics,
    dailyProjectMetrics,
    monthlyProjectMetrics,
    setProjectMetrics,
    project,
  } = props
  const [selectedLength, setSelectedLength] = useState<number>(180)
  const [buttons, setButtons] = useState<ButtonType[]>(initialButtons)
  const [chartType, setChartType] = useState<string>("historical")
  const [showAsPercentage, setShowAsPercentage] = useState(false)

  const { project_id } = project

  const [settings, setSettings] = useState<SettingType[]>([
    { key: "revenue_supply_side", color: colors[0] },
    { key: "revenue_protocol", color: colors[1] },
  ])

  const onSelectButton = (name: string) => {
    const newButtons = buttons.map((btn) => {
      if (btn.name === name) {
        return { ...btn, selected: !btn.selected }
      }

      return btn
    })

    setButtons(newButtons)
  }

  useEffect(() => {
    let isCanceled = false

    if (!!project) {
      fetchDailyProjectMetrics(project.project_id, 365).then(
        (data) => !isCanceled && setProjectMetrics("daily", data)
      )

      fetchMonthlyProjectMetrics(project.project_id).then(
        (data) => !isCanceled && setProjectMetrics("monthly", data)
      )
    }

    return () => {
      isCanceled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, project_id])

  const chartData = useMemo(
    () =>
      labelProjectDefaultData(
        defaultProjectMetrics,
        dailyProjectMetrics,
        monthlyProjectMetrics,
        selectedLength,
        chartType
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultProjectMetrics, selectedLength, chartType]
  )

  const cleaned = cleanChartData(
    chartData,
    settings.map((s) => s.key)
  )

  useEffect(() => {
    const selected = buttons
      .filter((btn) => btn.selected)
      .map((btn) => btn.name)
    let keysWithColors: SettingType[] = []
    if (selected.includes("revenue_supply_side")) {
      keysWithColors = keysWithColors.concat([
        {
          key: "revenue_supply_side",
          color: colors[0],
        },
      ])
    }

    if (selected.includes("revenue_protocol")) {
      keysWithColors = keysWithColors.concat([
        {
          key: "revenue_protocol",
          color: colors[1],
        },
      ])
    }
    setSettings(keysWithColors)
  }, [buttons])

  const buildString = () => {
    if (settings.length === 0) return ""
    let str = ""

    const isCumulative = chartType === "cumulative"

    if (selectedLength > 365) str += "Monthly "
    if (selectedLength <= 365) str += "Daily "
    if (isCumulative) str += "cumulative "

    settings.forEach((setting, index) => {
      if (index === 1) str += " and "
      if (setting.key === "revenue_supply_side") str += "supply-side revenue"
      if (setting.key === "revenue_protocol") str += "protocol revenue"
    })

    if (selectedLength <= 365)
      str += " in the past " + selectedLength + " days."
    if (selectedLength > 365) str += " since launch."

    return str
  }

  const getChartLabel = () => {
    const selectedButtons = buttons.filter((btn) => btn.selected)
    if (selectedButtons.length === 0) {
      return ""
    }

    if (selectedButtons.length === 2) {
      return "Total revenue"
    }

    if (selectedButtons[0].name === "revenue_supply_side") {
      return "Supply-side revenue"
    }
    return "Protocol revenue"
  }

  const pathname = window.location.pathname
  const chartTitle = pathname.includes("/embed/")
    ? `${project.name} revenue share`
    : "Revenue share"

  return (
    <ChartContainer
      title={chartTitle}
      name="revenue_share"
      url={
        window.location.origin +
        "/terminal/projects/" +
        project_id +
        "/revenue_share"
      }
      embedUrl={
        window.location.origin +
        "/terminal/projects/" +
        project_id +
        "/embed/revenue"
      }
      tooltipId="chart-revenue-share"
      infoString={buildString()}
      chartData={cleaned}
      chartKeys={settings.map((setting) => setting.key)}
      buttons={buttons}
      project={project}
      selectedLength={selectedLength}
      onSelectButton={onSelectButton}
      onChartLengthChange={setSelectedLength}
      onSelectChartType={setChartType}
      onSelectPercentageMode={setShowAsPercentage}
    >
      <StackedBarChart
        chartData={cleaned}
        settings={settings}
        tooltip={<RevenueSplitTooltip isPercentageShareOn={showAsPercentage} />}
        label={getChartLabel()}
        isPercentageShareOn={showAsPercentage}
      />
    </ChartContainer>
  )
}

export default RevenueShare
