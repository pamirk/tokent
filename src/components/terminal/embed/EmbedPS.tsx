import React, { useEffect, useState } from "react"

import { PSMetricsState, PSMetricsType } from "types/ApiTypes"
import { fetchPSMetrics } from "api/ApiCalls"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import { uniq, sortBy } from "lodash"
import { useData } from "context/DataContext"
import { useParams } from "react-router-dom"
import MetricCompetitive from "../metrics/MetricCompetitive"
import TotalPS from "../metrics/ps/TotalPS"

interface RouteParams {
  chartId: string
}

const EmbedPS = () => {
  const { projects } = useData()
  const { chartId } = useParams<RouteParams>()

  const [metrics, setMetrics] = useState<PSMetricsState>({
    daily: undefined,
    monthly: undefined,
  })

  const updateMetrics = (interval: string, data: PSMetricsType) => {
    setMetrics({ ...metrics, [interval]: data })
  }

  useEffect(() => {
    let isCanceled = false
    window.scrollTo(0, 0)
    fetchPSMetrics("daily").then(
      (data) => !isCanceled && updateMetrics("daily", data)
    )
    return () => {
      isCanceled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedByPS = uniq(
    sortBy(projects, "ps")
      .filter((project) => project.metric_availability["ps"])
      .map((project) => ({ name: project.project_id, label: project.name }))
  ).slice(0, 5)

  const renderChart = () => {
    switch (chartId) {
      case "total":
        return <TotalPS data={metrics} updateMetrics={updateMetrics} />

      case "competitive":
        return <MetricCompetitive top5={sortedByPS} metric="ps" />

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

export default EmbedPS
