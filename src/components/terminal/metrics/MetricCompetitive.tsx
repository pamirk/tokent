import React, { useEffect, useMemo, useState } from "react"

import CompetitiveChartContainer from "components/generic/charts/CompetitiveChartContainer"
import { labelCompetitiveChart } from "helpers/chartHelpers"
import { fetchDailyBulkMetrics, fetchMonthlyBulkMetrics } from "api/ApiCalls"
import { BulkMetricsStore } from "types/ApiTypes"
import CompetitiveChart from "components/generic/charts/CompetitiveChart"
import { OptionType } from "types/Types"
import { useData } from "context/DataContext"

type Props = {
  top5: OptionType[]
  metric: string
}

const MetricCompetitive = (props: Props) => {
  const { top5, metric } = props
  const { projects } = useData()

  const [selectedProjects, setSelectedProjects] = useState<OptionType[]>(top5)

  const [selectedLength, setSelectedLength] = useState<number>(180)
  const [chartType, setChartType] = useState("historical")
  const [metrics, setMetrics] = useState<BulkMetricsStore>({
    daily: undefined,
    monthly: undefined,
  })

  useEffect(() => {
    let isCanceled = false
    let projectString = ""

    selectedProjects.forEach(
      (project) => (projectString += `"${project.name}",`)
    )
    projectString = projectString.replace(/,\s*$/, "")

    if (selectedLength <= 365) {
      fetchDailyBulkMetrics([projectString]).then(
        (data) => !isCanceled && setMetrics({ ...metrics, daily: data })
      )
    } else {
      fetchMonthlyBulkMetrics([projectString]).then(
        (data) => !isCanceled && setMetrics({ ...metrics, monthly: data })
      )
    }

    return () => {
      isCanceled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjects, selectedLength])

  const chartData = useMemo(
    () =>
      labelCompetitiveChart(metrics, selectedLength, metric, false, chartType),
    [selectedLength, metrics, metric, chartType]
  )

  const chartKeys = selectedProjects.map((project) => project.label)

  if (!projects) return null

  const projectOptions = projects
    .filter(
      (project) =>
        !selectedProjects.some((e) => e.label === project.name) &&
        project.metric_availability[metric] === true
    )
    .map((project) => ({
      label: project.name,
      name: project.project_id,
    }))

  const buildString = () => {
    if (selectedProjects.length === 0) return ""

    let str = ""

    if (selectedLength > 365) str += "Monthly "
    if (selectedLength <= 365) str += "Daily "

    if (metric === "tvl") str += "total value locked"
    if (metric === "revenue_protocol") str += "protocol revenue"
    if (metric === "ps") str += "P/S ratio"
    if (metric === "pe") str += "P/E ratio"
    if (metric === "revenue") str += "revenue"
    str += " for "

    selectedProjects.forEach((project, index) => {
      if (index === selectedProjects.length - 1 && index >= 1) {
        str += " and "
      } else if (index > 0) {
        str += ", "
      }
      str += project.label
    })

    if (selectedLength <= 365)
      str += " in the past " + selectedLength + " days."
    if (selectedLength > 365) str += " since launch."

    return str
  }

  return (
    <CompetitiveChartContainer
      title="Competitive landscape"
      name={`${metric}-competitive-${metric}`}
      tooltipId="chart-metric-competitive"
      url={
        window.location.origin + "/terminal/metrics/" + metric + "/competitive"
      }
      embedUrl={
        window.location.origin +
        "/terminal/metrics/" +
        metric +
        "/embed/competitive"
      }
      chartKeys={chartKeys}
      infoString={buildString()}
      chartData={chartData}
      buttons={[]}
      selectedLength={selectedLength}
      selectedProjects={selectedProjects}
      projects={projectOptions}
      maxSelected={10}
      onChartLengthChange={setSelectedLength}
      onChangeSelectedProjects={setSelectedProjects}
      onChartMetricChange={() => {}}
      onSelectChartType={
        metric === "revenue" || metric === "revenue_protocol"
          ? setChartType
          : undefined
      }
    >
      <CompetitiveChart data={chartData} keys={chartKeys} metric={metric} />
    </CompetitiveChartContainer>
  )
}

export default MetricCompetitive
