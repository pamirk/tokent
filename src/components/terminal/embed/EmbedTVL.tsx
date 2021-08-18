import React, { useEffect, useState } from "react"

import { TVLMetricsType, TVLMetricsState } from "types/ApiTypes"
import { fetchTVLMetrics } from "api/ApiCalls"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import { sortBy, uniq } from "lodash"
import { useData } from "context/DataContext"
import { useParams } from "react-router-dom"
import AvgTVL from "../metrics/tvl/AvgTVL"
import MetricCompetitive from "../metrics/MetricCompetitive"
import TotalTVL from "../metrics/tvl/TotalTVL"

interface RouteParams {
  chartId: string
}
const EmbedTVL = () => {
  const { projects } = useData()
  const { chartId } = useParams<RouteParams>()

  const [metrics, setMetrics] = useState<TVLMetricsState>({
    daily: undefined,
    monthly: undefined,
  })

  const updateMetrics = (interval: string, data: TVLMetricsType) => {
    setMetrics({ ...metrics, [interval]: data })
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    let isCanceled = false
    fetchTVLMetrics("daily").then(
      (data) => !isCanceled && updateMetrics("daily", data)
    )

    return () => {
      isCanceled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedByTVL = uniq(
    sortBy(projects, "tvl")
      .filter((project) => project.metric_availability["tvl"])
      .map((project) => ({ name: project.project_id, label: project.name }))
  )
    .reverse()
    .slice(0, 5)

  const renderChart = () => {
    switch (chartId) {
      case "total":
        return <AvgTVL data={metrics} updateMetrics={updateMetrics} />

      case "historical":
        return <TotalTVL data={metrics} updateMetrics={updateMetrics} />

      case "competitive":
        return <MetricCompetitive top5={sortedByTVL} metric="tvl" />

      default:
        return <span>{"Invalid chart id"}</span>
    }
  }
  return (
    <Container>
      {metrics["daily"] ? renderChart() : <ChartLoadingAnimation />}
    </Container>
  )
}

export default EmbedTVL
