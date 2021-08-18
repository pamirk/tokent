import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

import CompetitiveChartContainer from "components/generic/charts/CompetitiveChartContainer"
import { cleanChartData, labelCompetitiveChart } from "helpers/chartHelpers"
import { fetchDailyBulkMetrics, fetchMonthlyBulkMetrics } from "api/ApiCalls"
import { BulkMetricsStore, ProjectType } from "types/ApiTypes"
import CompetitiveChart from "components/generic/charts/CompetitiveChart"
import { OptionType } from "types/Types"
import { useData } from "context/DataContext"

interface RouteParams {
  projectId: string
}

type Props = { project?: ProjectType }

const Competitive = (props: Props) => {
  const { projectId } = useParams<RouteParams>()
  const [selectedProjects, setSelectedProjects] = useState<OptionType[]>([])
  const [selectedLength, setSelectedLength] = useState<number>(180)
  const [chartMetric, setChartMetric] = useState({
    label: "Total rev.",
    name: "revenue",
  })
  const [metrics, setMetrics] = useState<BulkMetricsStore>({
    daily: undefined,
    monthly: undefined,
  })

  const { project } = props
  const { projects } = useData()

  const isExchange = project?.category_tags.includes("Exchange") || false

  const projectOptions = projects
    ? projects
        .filter(
          (project) =>
            !selectedProjects.some((e) => e.label === project.name) &&
            project.metric_availability[chartMetric.name] === true
        )
        .map((project) => ({
          label: project.name,
          name: project.project_id,
        }))
    : []

  useEffect(() => {
    let isCanceled = false
    if (!project?.metric_availability[chartMetric.name]) {
      !isCanceled && setChartMetric({ label: "Total rev.", name: "revenue" })
    }

    // initialize 5 projects with same category and which have the selected metric available
    const projectsWithSameCategories = projects
      ? projects
          .filter(
            (project) =>
              project.category_tags.split(",")[1] ===
                project?.category_tags.split(",")[1] &&
              project.metric_availability[chartMetric.name] === true &&
              project.project_id !== projectId
          )
          .map((project) => ({ name: project.project_id, label: project.name }))
      : []

    const newSelectedProjects = [
      { label: project?.name || projectId, name: projectId },
    ].concat(projectsWithSameCategories.slice(0, 5))

    !isCanceled && setSelectedProjects(newSelectedProjects)

    return () => {
      isCanceled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  useEffect(() => {
    let isCanceled = false
    let projectString = `"${projectId}"`
    selectedProjects.forEach(
      (project) => (projectString += `, "${project.name}"`)
    )

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
  }, [selectedProjects, selectedLength, projectId])

  const chartData = useMemo(
    () =>
      labelCompetitiveChart(
        metrics,
        selectedLength,
        chartMetric.name,
        isExchange,
        "historical"
      ),
    [selectedLength, metrics, chartMetric, isExchange]
  )

  const getVisibleButtons = () => {
    if (!project) return []

    const {
      market_cap,
      tvl,
      gmv,
      revenue,
      ps,
      revenue_protocol,
      revenue_supply_side,
      volume,
      pe,
    } = project.metric_availability

    return [
      {
        label: "Fully-diluted mc.",
        name: "market_cap_fully_diluted",
        disabled: !market_cap,
      },
      {
        label: "Circulating mc.",
        name: "market_cap_circulating",
        disabled: !market_cap,
      },
      { label: "Token trading vol.", name: "volume", disabled: !volume },
      { label: "TVL", name: "tvl", disabled: !tvl },
      { label: "GMV", name: "gmv", disabled: !gmv },

      { label: "Total revenue", name: "revenue", disabled: !revenue },

      {
        label: "Supply-side revenue",
        name: "revenue_supply_side",
        disabled: !revenue_supply_side,
      },
      {
        label: "Protocol revenue",
        name: "revenue_protocol",
        disabled: !revenue_protocol,
      },
      { label: "P/S ratio", name: "ps", disabled: !ps },
      { label: "P/E ratio", name: "pe", disabled: !pe },
    ]
  }

  const chartKeys = selectedProjects.map((project) => project.label)

  const cleaned = cleanChartData(chartData, chartKeys)

  const buildString = () => {
    if (selectedProjects.length === 0) return ""

    let str = ""

    if (selectedLength > 365) str += "Monthly "
    if (selectedLength <= 365) str += "Daily "

    if (chartMetric.name === "tvl") str += "total value locked"
    if (chartMetric.name === "gmv") str += "GMV"
    if (chartMetric.name === "market_cap_fully_diluted")
      str += "fully-diluted market cap"
    if (chartMetric.name === "market_cap_circulating")
      str += "circulating market cap"
    if (chartMetric.name === "revenue") str += "total revenue"
    if (chartMetric.name === "revenue_supply_side") str += "supply-side revenue"
    if (chartMetric.name === "revenue_protocol") str += "protocol revenue"
    if (chartMetric.name === "ps") str += "P/S ratio"
    if (chartMetric.name === "volume") str += "token trading volume"

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
      tooltipId="chart-competitive"
      url={
        window.location.origin +
        "/terminal/projects/" +
        projectId +
        "/competitive"
      }
      embedUrl={
        window.location.origin +
        "/terminal/projects/" +
        projectId +
        "/embed/competitive"
      }
      name={`competitive-${chartMetric.name}`}
      chartKeys={chartKeys}
      infoString={buildString()}
      buttons={getVisibleButtons()}
      project={project}
      chartData={cleaned}
      maxSelected={10}
      selectedLength={selectedLength}
      selectedProjects={selectedProjects}
      projects={projectOptions}
      selectedChartMetric={chartMetric.label}
      onChartLengthChange={setSelectedLength}
      onChangeSelectedProjects={setSelectedProjects}
      onChartMetricChange={setChartMetric}
    >
      <CompetitiveChart
        data={cleaned}
        keys={chartKeys}
        metric={chartMetric.name}
      />
    </CompetitiveChartContainer>
  )
}

export default Competitive
