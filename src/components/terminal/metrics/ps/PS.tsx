import React, { useEffect, useState } from "react"

import { PSInfoType, PSMetricsState, PSMetricsType } from "types/ApiTypes"
import PSTable from "./PSTable"
import { fetchPSInfo, fetchPSMetrics } from "api/ApiCalls"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import TotalPS from "./TotalPS"
import { uniq, sortBy } from "lodash"
import MetricCompetitive from "../MetricCompetitive"
import PSInfo from "./PSInfo"
import { useData } from "context/DataContext"

const PS = () => {
  const { projects } = useData()

  document.title = "Token Terminal | Price to sales metrics"

  const [info, setInfo] = useState<PSInfoType | undefined>(undefined)
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
    fetchPSInfo().then((data) => !isCanceled && setInfo(data))
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

  return (
    <Container>
      <PSInfo data={info} title="Price to sales (P/S) ratio" />
      {!metrics.daily && <ChartLoadingAnimation />}
      {metrics.daily && (
        <>
          <TotalPS data={metrics} updateMetrics={updateMetrics} />
          <MetricCompetitive top5={sortedByPS} metric="ps" />
        </>
      )}
      <PSTable />
    </Container>
  )
}

export default PS
