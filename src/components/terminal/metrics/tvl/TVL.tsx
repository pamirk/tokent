import React, { useEffect, useState } from "react"

import { TVLMetricsType, TVLMetricsState, TVLInfoType } from "types/ApiTypes"
import { fetchTVLInfo, fetchTVLMetrics } from "api/ApiCalls"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import { sortBy, uniq } from "lodash"
import MetricCompetitive from "../MetricCompetitive"
import AvgTVL from "./AvgTVL"
import TVLInfo from "./TVLInfo"
import TotalTVL from "./TotalTVL"
import TVLTable from "./TVLTable"
import { useData } from "context/DataContext"

const TVL = () => {
  const { projects } = useData()

  document.title = "Token Terminal | Total value locked metrics"

  const [info, setInfo] = useState<TVLInfoType | undefined>(undefined)
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
    fetchTVLInfo().then((data) => !isCanceled && setInfo(data))
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

  return (
    <Container>
      <TVLInfo data={info} title="Total value locked (TVL)" />
      {!metrics["daily"] && <ChartLoadingAnimation />}
      {metrics["daily"] && (
        <>
          <AvgTVL data={metrics} updateMetrics={updateMetrics} />
          <TotalTVL data={metrics} updateMetrics={updateMetrics} />

          <MetricCompetitive top5={sortedByTVL} metric="tvl" />
        </>
      )}
      <TVLTable />
    </Container>
  )
}

export default TVL
