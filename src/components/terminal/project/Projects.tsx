import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import ProjectInfo from "./ProjectInfo"
import { ProjectMetricsType, Top10ProjectMetrics } from "types/ApiTypes"
import { fetchDailyProjectMetrics, fetchDailyProjectTop10 } from "api/ApiCalls"
import KeyMetrics from "./KeyMetrics"
import RevenueSplit from "./RevenueShare"
import Composition from "./Composition"
import OverviewTable from "components/home/overview/overviewTable/OverviewTable"
import Competitive from "./Competitive"
import { useData } from "context/DataContext"
import { Container } from "components/generic/charts/ChartComponents"

interface RouteParams {
  projectId: string
  section: string
}

const Projects = () => {
  const { projects } = useData()
  const { projectId, section } = useParams<RouteParams>()
  const project = projects?.find((p) => p.project_id === projectId)

  document.title = `Token Terminal | ${project?.name} metrics`

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
    if (!section) window.scrollTo(0, 0)
    if (!project) return

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

  return (
    <Container>
      {project && (
        <>
          <ProjectInfo key={projectId} project={project} />
          <KeyMetrics
            defaultProjectMetrics={defaultMetrics}
            dailyProjectMetrics={dailyMetrics}
            monthlyProjectMetrics={monthlyMetrics}
            setProjectMetrics={updateProjectMetrics}
            project={project}
          />
          {project?.metric_availability.revenue && (
            <RevenueSplit
              defaultProjectMetrics={defaultMetrics}
              dailyProjectMetrics={dailyMetrics}
              monthlyProjectMetrics={monthlyMetrics}
              setProjectMetrics={updateProjectMetrics}
              project={project}
            />
          )}

          <Composition
            defaultTop10Metrics={defaultTop10tMetrics}
            dailyTop10Metrics={dailyTop10Metrics}
            monthlyTop10Metrics={monthlyTopMetrics}
            setTop10Metrics={updateTop10Metrics}
            project={project}
          />

          <Competitive project={project} />
          <OverviewTable />
        </>
      )}
    </Container>
  )
}

export default Projects
