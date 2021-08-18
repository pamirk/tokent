import { fetchDailyProjectMetrics, fetchDailyProjectTop10 } from "api/ApiCalls"
import { Container } from "components/generic/charts/ChartComponents"
import { useData } from "context/DataContext"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ProjectMetricsType, Top10ProjectMetrics } from "types/ApiTypes"
import Competitive from "../project/Competitive"
import Composition from "../project/Composition"
import KeyMetrics from "../project/KeyMetrics"
import RevenueShare from "../project/RevenueShare"

interface RouteParams {
  chartId: string
  projectId: string
}

const EmbedProjects = () => {
  const { projects } = useData()
  const { projectId, chartId } = useParams<RouteParams>()
  const project = projects?.find((p) => p.project_id === projectId)

  const [defaultMetrics, setDefaultMetrics] = useState<ProjectMetricsType>(
    undefined
  )

  const [dailyMetrics, setDailyMetrics] = useState<ProjectMetricsType>(
    undefined
  )
  const [monthlyMetrics, setMonthlyMetrics] = useState<ProjectMetricsType>(
    undefined
  )

  const [
    defaultTop10tMetrics,
    setDefaultTop10Metrics,
  ] = useState<Top10ProjectMetrics>(undefined)
  const [
    dailyTop10Metrics,
    setDailyTop10Metrics,
  ] = useState<Top10ProjectMetrics>(undefined)
  const [
    monthlyTopMetrics,
    setMonthlyTop10Metrics,
  ] = useState<Top10ProjectMetrics>(undefined)

  useEffect(() => {
    let isCanceled = false
    if (!project) return
    if (!chartId) return

    setDefaultMetrics(undefined)
    setDefaultTop10Metrics(undefined)
    setDailyMetrics(undefined)
    setDailyTop10Metrics(undefined)

    const hasCompositionData = Object.values(
      project.metric_availability?.composition
    ).includes(true)

    fetchDailyProjectMetrics(project.project_id, 180)
      .then(setDefaultMetrics)
      .then(
        () =>
          hasCompositionData &&
          fetchDailyProjectTop10(project.project_id, 180).then(
            (data) => !isCanceled && setDefaultTop10Metrics(data)
          )
      )

    return () => {
      isCanceled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, projectId])

  const updateProjectMetrics = (interval: string, data: ProjectMetricsType) => {
    if (interval === "daily") {
      setDailyMetrics(data)
    } else {
      setMonthlyMetrics(data)
    }
  }

  const updateTop10Metrics = (interval: string, data: any) => {
    if (interval === "daily") {
      setDailyTop10Metrics(data)
    } else {
      setMonthlyTop10Metrics(data)
    }
  }

  const renderChart = () => {
    if (!project) return
    switch (chartId) {
      case "key_metrics":
        return (
          <KeyMetrics
            defaultProjectMetrics={defaultMetrics}
            dailyProjectMetrics={dailyMetrics}
            monthlyProjectMetrics={monthlyMetrics}
            setProjectMetrics={updateProjectMetrics}
            project={project}
          />
        )

      case "revenue":
        return (
          <RevenueShare
            defaultProjectMetrics={defaultMetrics}
            dailyProjectMetrics={dailyMetrics}
            monthlyProjectMetrics={monthlyMetrics}
            setProjectMetrics={updateProjectMetrics}
            project={project}
          />
        )

      case "composition":
        return (
          <Composition
            defaultTop10Metrics={defaultTop10tMetrics}
            dailyTop10Metrics={dailyTop10Metrics}
            monthlyTop10Metrics={monthlyTopMetrics}
            setTop10Metrics={updateTop10Metrics}
            project={project}
          />
        )

      case "competitive":
        return <Competitive project={project} />

      default:
        return <span>{"Invalid chart id"}</span>
    }
  }

  return <Container>{renderChart()}</Container>
}

export default EmbedProjects
