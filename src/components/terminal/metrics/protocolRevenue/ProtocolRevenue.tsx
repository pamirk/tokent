import React, { useEffect, useState } from "react"

import {
  RevenueMetricsState,
  RevenueMetricsType,
  RevenueProtocolInfoType,
} from "types/ApiTypes"
import { fetchProtocolRevenueInfo } from "api/ApiCalls"
import HistoricalProtocolRevenue from "./HistoricalProtocolRevenue"
import CumulativeProtocolRevenue from "./CumulativeProtocolRevenue"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import { uniq, sortBy } from "lodash"
import MetricCompetitive from "../MetricCompetitive"
import ProtocolRevenueInfo from "./ProtocolRevenueInfo"
import ProtocolRevenueTable from "./ProtocolRevenueTable"
import { useData } from "context/DataContext"

const ProtocolRevenue = () => {
  const { projects, revenueProtocol } = useData()

  document.title = "Token Terminal | Protocol revenue metrics"

  const [info, setInfo] = useState<RevenueProtocolInfoType | undefined>(
    undefined
  )
  const [metrics, setMetrics] = useState<RevenueMetricsState>({
    daily: revenueProtocol,
    monthly: undefined,
  })

  const updateMetrics = (interval: string, data: RevenueMetricsType) => {
    setMetrics({ ...metrics, [interval]: data })
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    let isCanceled = false
    fetchProtocolRevenueInfo().then((data) => !isCanceled && setInfo(data))

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

  return (
    <Container>
      <ProtocolRevenueInfo data={info} />
      {metrics["daily"] ? (
        <>
          <CumulativeProtocolRevenue
            data={metrics}
            updateMetrics={updateMetrics}
          />
          <HistoricalProtocolRevenue
            data={metrics}
            updateMetrics={updateMetrics}
          />
          <MetricCompetitive top5={sortedByRevenue} metric="revenue_protocol" />
        </>
      ) : (
        <ChartLoadingAnimation />
      )}
      <ProtocolRevenueTable />
    </Container>
  )
}

export default ProtocolRevenue
