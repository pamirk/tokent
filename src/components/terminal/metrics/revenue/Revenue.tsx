import React, { useEffect, useState } from "react"

import {
  RevenueMetricsState,
  RevenueMetricsType,
  RevenueInfoType,
} from "types/ApiTypes"
import TotalRevenue from "./TotalRevenue"
import RevenueTable from "./RevenueTable"
import { fetchRevenueInfo, fetchRevenueMetrics } from "api/ApiCalls"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import { sortBy, uniq } from "lodash"
import MetricCompetitive from "../MetricCompetitive"
import RevenueInfo from "./RevenueInfo"
import CumulativeRevenue from "./CumulativeRevenue"
import { useData } from "context/DataContext"

const Revenue = () => {
  const { projects } = useData()

  document.title = "Token Terminal | Revenue metrics"

  const [revenueInfo, setRevenueInfo] = useState<RevenueInfoType | undefined>(
    undefined
  )
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
    fetchRevenueInfo().then((data) => !isCanceled && setRevenueInfo(data))
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

  return (
    <Container>
      <RevenueInfo data={revenueInfo} />
      {!revenueMetrics["daily"] && <ChartLoadingAnimation />}
      {revenueMetrics["daily"] && (
        <>
          <CumulativeRevenue
            data={revenueMetrics}
            updateMetrics={updateRevenueMetrics}
          />
          <TotalRevenue
            data={revenueMetrics}
            updateMetrics={updateRevenueMetrics}
          />
          <MetricCompetitive top5={sortedByRevenue} metric="revenue" />
        </>
      )}
      <RevenueTable />
    </Container>
  )
}

export default Revenue
