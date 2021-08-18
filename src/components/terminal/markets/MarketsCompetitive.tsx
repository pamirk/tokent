import React, { useEffect, useMemo, useState } from "react"

import CompetitiveChartContainer from "components/generic/charts/CompetitiveChartContainer"
import {
  allowedCumulativeMetrics,
  labelMarketMetrics,
} from "helpers/chartHelpers"
import { fetchMarketMetrics } from "api/ApiCalls"
import {
  MarketMetricsState,
  MarketMetricsType,
  MarketMetricType,
} from "types/ApiTypes"
import CompetitiveChart from "components/generic/charts/CompetitiveChart"
import { OptionType } from "types/Types"
import { capitalize } from "helpers/download/download"

type Props = {
  data: MarketMetricsState
  marketId: string
  updateMarketMetrics: (interval: string, data: MarketMetricsType) => void
}

const buttons = [
  { label: "GMV", name: "gmv" },
  { label: "Market cap", name: "market_cap" },
  { label: "P/S ratio", name: "ps" },
  { label: "P/E ratio", name: "pe" },
  { label: "Revenue", name: "revenue" },
  { label: "TVL", name: "tvl" },
]

const MarketsCompetitive = (props: Props) => {
  const [selectedProjects, setSelectedProjects] = useState<OptionType[]>([])
  const [chartType, setChartType] = useState<string>("historical")
  const [selectedLength, setSelectedLength] = useState<number>(180)
  const [chartMetric, setChartMetric] = useState({
    label: "Revenue",
    name: "revenue",
  })

  const { data, marketId, updateMarketMetrics } = props

  const isExchange = marketId.toLowerCase() === "exchange"

  const projects = useMemo(
    () =>
      Array.from(
        new Set(data["daily"]?.map((item: MarketMetricType) => item.project))
      ),
    [data]
  )

  useEffect(() => {
    if (!data["daily"]) return

    const defaultSelectedButtons = projects
      .filter((project) => project !== "Other")
      .slice(0, 5)
      .map((project) => ({ label: project, name: project }))
    setSelectedProjects(defaultSelectedButtons)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, projects, marketId])

  useEffect(() => {
    let isCanceled = false

    const { monthly } = data

    if (!monthly && selectedLength > 365) {
      fetchMarketMetrics(marketId, "monthly").then(
        (result) => !isCanceled && updateMarketMetrics("monthly", result)
      )
    }

    return () => {
      isCanceled = true
    }
  }, [data, marketId, selectedLength, updateMarketMetrics])

  const keys = selectedProjects.map((project) => project.label)

  const chartData = useMemo(
    () =>
      labelMarketMetrics(
        data,
        selectedLength,
        chartMetric.name,
        chartType,
        isExchange,
        keys
      ),
    [selectedLength, data, keys, chartMetric.name, isExchange, chartType]
  )

  const projectOptions = projects
    .filter((project) => !keys.includes(project))
    .map((project) => ({
      label: project,
      name: project,
    }))

  const buildString = () => {
    if (selectedProjects.length === 0) return ""

    const isCumulative = chartType === "cumulative"

    let str = ""

    if (selectedLength > 365) str += "Monthly "
    if (selectedLength <= 365) str += "Daily "

    if (isCumulative && allowedCumulativeMetrics.includes(chartMetric.name)) {
      if (!(chartMetric.name === "gmv" && !isExchange)) {
        str += "cumulative "
      }
    }

    if (chartMetric.name === "tvl") str += "total value locked"
    if (chartMetric.name === "gmv") str += "GMV"
    if (chartMetric.name === "market_cap") str += "market cap"
    if (chartMetric.name === "revenue") str += "revenue"
    if (chartMetric.name === "ps") str += "P/S ratio"
    if (chartMetric.name === "pe") str += "P/E ratio"

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

  const pathname = window.location.pathname
  const chartTitle = pathname.includes("/embed/")
    ? `${capitalize(marketId)} competitive landscape`
    : "Competitive landscape"

  return (
    <CompetitiveChartContainer
      title={chartTitle}
      tooltipId="chart-competitive"
      url={
        window.location.origin +
        "/terminal/markets/" +
        marketId +
        "/competitive"
      }
      embedUrl={
        window.location.origin +
        "/terminal/markets/" +
        marketId +
        "/embed/competitive"
      }
      name={`${marketId}-competitive-${chartMetric.name}`}
      chartKeys={keys}
      chartData={chartData}
      buttons={buttons}
      infoString={buildString()}
      selectedLength={selectedLength}
      selectedProjects={selectedProjects}
      projects={projectOptions}
      maxSelected={10}
      selectedChartMetric={chartMetric.label}
      onChartLengthChange={setSelectedLength}
      onChangeSelectedProjects={setSelectedProjects}
      onChartMetricChange={setChartMetric}
      onSelectChartType={isExchange ? setChartType : undefined}
    >
      <CompetitiveChart
        data={chartData}
        keys={keys}
        metric={chartMetric.name}
      />
    </CompetitiveChartContainer>
  )
}

export default MarketsCompetitive
