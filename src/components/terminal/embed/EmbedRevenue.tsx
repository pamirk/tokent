import React, { useEffect, useState } from "react"

import { RevenueMetricsState, RevenueMetricsType } from "types/ApiTypes"
import { fetchRevenueMetrics } from "api/ApiCalls"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import { sortBy, uniq } from "lodash"
import { useData } from "context/DataContext"
import { useParams } from "react-router-dom"
import MetricCompetitive from "../metrics/MetricCompetitive"
import CumulativeRevenue from "../metrics/revenue/CumulativeRevenue"
import TotalRevenue from "../metrics/revenue/TotalRevenue"

interface RouteParams {
  chartId: string
}
const EmbedRevenue = () => {
  const { projects } = useData()
  const { chartId } = useParams<RouteParams>()

  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetricsState>({
    daily: undefined,
    monthly: undefined,
  })

  const updateRevenueMetrics = (interval: string, data: RevenueMetricsType) => {
    setRevenueMetrics({ ...revenueMetrics, [interval]: data })
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    let isCanceled = false
    fetchRevenueMetrics("daily").then(
      (data) => !isCanceled && updateRevenueMetrics("daily", data)
    )

    return () => {
      isCanceled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedByRevenue = uniq(
    sortBy(projects, "revenue_180d")
      .filter((project) => project.metric_availability["revenue"])
      .map((project) => ({ name: project.project_id, label: project.name }))
  )
    .reverse()
    .slice(0, 5)

  const renderChart = () => {
    switch (chartId) {
      case "total":
        return (
          <CumulativeRevenue
            data={revenueMetrics}
            updateMetrics={updateRevenueMetrics}
          />
        )

      case "historical":
        return (
          <TotalRevenue
            data={revenueMetrics}
            updateMetrics={updateRevenueMetrics}
          />
        )
      case "competitive":
        return <MetricCompetitive top5={sortedByRevenue} metric="revenue" />

      default:
        return <span>{"Invalid chart id"}</span>
    }
  }

  return (
    <Container>
      {revenueMetrics["daily"] ? renderChart() : <ChartLoadingAnimation />}
    </Container>
  )
}

export default EmbedRevenue
