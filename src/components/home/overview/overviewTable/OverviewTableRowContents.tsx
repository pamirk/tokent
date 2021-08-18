import React, { useEffect, useMemo, useState } from "react"
import styled from "styled-components"

import { ProjectMetricsType, ProjectType } from "types/ApiTypes"
import ArrowRight from "utils/arrowRight.svg"
import { Link } from "react-router-dom"
import ProjectInfo from "components/terminal/project/ProjectInfo"
import { borderColor, textColor } from "context/theme"
import KeyMetrics from "components/terminal/project/KeyMetrics"
import { fetchDailyProjectMetrics } from "api/ApiCalls"
import { useData } from "context/DataContext"
import { useTheme } from "context/ThemeContext"
const RowContents = (props: { project: ProjectType }) => {
  const { project } = props
  const { projects } = useData()
  const { mode } = useTheme()

  const [defaultMetrics, setDefaultMetrics] = useState<ProjectMetricsType>(
    undefined
  )

  const [dailyMetrics, setDailyMetrics] = useState<ProjectMetricsType>(
    undefined
  )
  const [monthlyMetrics, setMonthlyMetrics] = useState<ProjectMetricsType>(
    undefined
  )

  useEffect(() => {
    let isCanceled = false

    if (!!project) {
      fetchDailyProjectMetrics(project.project_id, 180).then(
        (d) => !isCanceled && setDefaultMetrics(d)
      )
    }

    return () => {
      isCanceled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, project.project_id])

  const updateProjectMetrics = (interval: string, data: ProjectMetricsType) => {
    if (interval === "daily") {
      setDailyMetrics(data)
    } else {
      setMonthlyMetrics(data)
    }
  }
  const similar = useMemo(
    () =>
      projects
        ?.filter((p) => p.category_tags.includes(project.category_tags[1]))
        .slice(0, 5),
    [project.category_tags, projects]
  )

  return (
    <RowContentsContainer>
      <ProjectLink
        style={{ background: mode === "light" ? "#dffff5" : "#505050" }}
        to={`/terminal/projects/${project.project_id}`}
      >
        {`${project.name} dashboard`}
        <ArrowImg src={ArrowRight} alt="Go to project page" />
      </ProjectLink>
      <ProjectInfo project={project} />
      <KeyMetrics
        defaultProjectMetrics={defaultMetrics}
        dailyProjectMetrics={dailyMetrics}
        monthlyProjectMetrics={monthlyMetrics}
        setProjectMetrics={updateProjectMetrics}
        project={project}
      />
      <SimilarProjects>
        <div>{"People also viewed"}</div>
        <div
          style={{ display: "flex", margin: "10px 0px 0px", flexWrap: "wrap" }}
        >
          {similar?.map((p) => (
            <SimilarButton
              key={p.project_id}
              to={`/terminal/projects/${p.project_id}`}
            >
              {p.name}
            </SimilarButton>
          ))}
        </div>
      </SimilarProjects>
    </RowContentsContainer>
  )
}

export default RowContents

export const ProjectDescription = (props: {
  title: string
  text: string
  imgPostFix: string
}) => {
  const { title, text, imgPostFix } = props
  return (
    <InfoContainer>
      <InfoImg
        src={"https://d2kyooqkgm9ipp.cloudfront.net/" + imgPostFix}
        alt="Logo"
      />
      <InfoTitle>{title + "?"}</InfoTitle>
      <InfoText>{text}</InfoText>
    </InfoContainer>
  )
}

const InfoImg = styled.img`
  width: 24px;
  height: 24px;
  margin-bottom: 8px;
  border-radius: 24px;
`

const InfoContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 8px;
  margin-bottom: 8px;
  margin-right: 24px;
  &:last-of-type {
    margin-right: 0px;
  }
`
const InfoTitle = styled.div`
  font-weight: bold;
  font-size: 13px;
  line-height: 19px;
  color: ${textColor};
`
const InfoText = styled.div`
  font-size: 12px;
  line-height: 19px;
  margin-bottom: 8px;
`

const RowContentsContainer = styled.div`
  box-shadow: rgb(34 34 34 / 14%) 0px 4px 13px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  margin: 0px 0px 4px 0px;
  border-bottom: 1px solid ${borderColor};
`

const ProjectLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  cursor: pointer;

  height: 44px;

  font-family: FKGrotesk-SemiMono;
  font-weight: bold;
  font-size: 14px;
  border-bottom: 1px solid ${borderColor};

  color: ${textColor};
`

const ArrowImg = styled.img`
  height: 14px;
  margin-left: 4px;
`

const SimilarProjects = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-top: 1px solid ${borderColor};
`

const SimilarButton = styled(Link)`
  font-size: 11px;

  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  background-color: transparent;
  color: #00cf9d;
  border: 1px solid #00cf9d;
  margin: 0px 8px 8px 0px;
  min-width: 60px;
  height: 22px;
  padding: 0px 10px;

  &:hover {
    background-color: #00cf9d;
    color: #ffffff;
  }
`
