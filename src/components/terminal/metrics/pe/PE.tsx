import React, { useEffect, useState } from "react"

import { PEInfoType, PEMetricsState, PEMetricsType } from "types/ApiTypes"
import { fetchPEInfo, fetchPEMetrics } from "api/ApiCalls"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import { uniq, sortBy } from "lodash"
import MetricCompetitive from "../MetricCompetitive"
import PEInfo from "./PEInfo"
import TotalPE from "./TotalPE"
import PETable from "./PETable"
import { useData } from "context/DataContext"

const PE = () => {
  const { projects } = useData()
  const [info, setInfo] = useState<PEInfoType | undefined>(undefined)
  const [metrics, setMetrics] = useState<PEMetricsState>({
    daily: undefined,
    monthly: undefined,
  })

  document.title = "Token Terminal | Price to earnings metrics"

  const updateMetrics = (interval: string, data: PEMetricsType) => {
    setMetrics({ ...metrics, [interval]: data })
  }

  useEffect(() => {
    let isCanceled = false
    window.scrollTo(0, 0)
    fetchPEInfo().then((data) => !isCanceled && setInfo(data))
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

  return (
    <Container>
      <PEInfo data={info} title="Price to earnings (P/E) ratio" />
      {!metrics.daily && <ChartLoadingAnimation />}
      {metrics.daily && (
        <>
          <TotalPE data={metrics} updateMetrics={updateMetrics} />
          <MetricCompetitive top5={sortedByPe} metric="pe" />
        </>
      )}
      <PETable />
    </Container>
  )
}

export default PE
