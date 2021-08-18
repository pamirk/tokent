import React, { useEffect, useState } from "react"

import { RevenueMetricsState, RevenueMetricsType } from "types/ApiTypes"
import { fetchProtocolRevenueMetrics } from "api/ApiCalls"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import { uniq, sortBy } from "lodash"
import { useData } from "context/DataContext"
import { useParams } from "react-router-dom"
import MetricCompetitive from "../metrics/MetricCompetitive"
import CumulativeProtocolRevenue from "../metrics/protocolRevenue/CumulativeProtocolRevenue"
import HistoricalProtocolRevenue from "../metrics/protocolRevenue/HistoricalProtocolRevenue"

interface RouteParams {
  chartId: string
}
const EmbedProtocolRevenue = () => {
  const { projects } = useData()
  const { chartId } = useParams<RouteParams>()

  const [metrics, setMetrics] = useState<RevenueMetricsState>({
    daily: undefined,
    monthly: undefined,
  })

  const updateMetrics = (interval: string, data: RevenueMetricsType) => {
    setMetrics({ ...metrics, [interval]: data })
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    let isCanceled = false
    fetchProtocolRevenueMetrics("daily").then(
      (data) => !isCanceled && updateMetrics("daily", data)
    )

    return () => {
      isCanceled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedByRevenue = uniq(
    sortBy(projects, "revenue_protocol_7d")
      .filter((project) => project.metric_availability["revenue"])
      .map((project) => ({ name: project.project_id, label: project.name }))
  )
    .reverse()
    .slice(0, 5)

  const renderChart = () => {
    switch (chartId) {
      case "cumulative":
        return (
          <CumulativeProtocolRevenue
            data={metrics}
            updateMetrics={updateMetrics}
          />
        )

      case "historical":
        return (
          <HistoricalProtocolRevenue
            data={metrics}
            updateMetrics={updateMetrics}
          />
        )

      case "competitive":
        return (
          <MetricCompetitive top5={sortedByRevenue} metric="revenue_protocol" />
        )

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

export default EmbedProtocolRevenue
