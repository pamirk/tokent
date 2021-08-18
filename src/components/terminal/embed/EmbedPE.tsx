import React, { useEffect, useState } from "react"

import { PEMetricsState, PEMetricsType } from "types/ApiTypes"
import { fetchPEMetrics } from "api/ApiCalls"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import { uniq, sortBy } from "lodash"
import { useData } from "context/DataContext"
import { useParams } from "react-router-dom"
import MetricCompetitive from "../metrics/MetricCompetitive"
import TotalPE from "../metrics/pe/TotalPE"

interface RouteParams {
  chartId: string
}
const EmbedPE = () => {
  const { projects } = useData()
  const { chartId } = useParams<RouteParams>()

  const [metrics, setMetrics] = useState<PEMetricsState>({
    daily: undefined,
    monthly: undefined,
  })

  const updateMetrics = (interval: string, data: PEMetricsType) => {
    setMetrics({ ...metrics, [interval]: data })
  }

  useEffect(() => {
    let isCanceled = false
    window.scrollTo(0, 0)
    fetchPEMetrics("daily").then(
      (data) => !isCanceled && updateMetrics("daily", data)
    )
    return () => {
      isCanceled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedByPe = uniq(
    sortBy(projects, "pe")
      .filter((project) => project.metric_availability["pe"])
      .map((project) => ({ name: project.project_id, label: project.name }))
  ).slice(0, 5)

  const renderChart = () => {
    switch (chartId) {
      case "total":
        return <TotalPE data={metrics} updateMetrics={updateMetrics} />

      case "competitive":
        return <MetricCompetitive top5={sortedByPe} metric="ps" />

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

export default EmbedPE
