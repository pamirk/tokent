import React, { useState, useEffect } from "react"
import styled from "styled-components"

import AVAILABLE_EXCHANGES from "constants/projects"
import { isEqual } from "lodash"
import { ProjectType } from "types/ApiTypes"
import {
  ContentsSection,
  DataColumnTitle,
  Header,
  PriceDetails,
  ProjectImg,
} from "components/generic/terminal/Info"
import { ProjectDescription } from "components/home/overview/overviewTable/OverviewTableRowContents"
import { ProjectDetails } from "./ProjectDetails"
import { ProjectDetailsMobile } from "./ProjectDetailsMobile"
import Tooltip from "components/generic/tooltip/Tooltip"
import { borderColor } from "context/theme"
import { useData } from "context/DataContext"
import { Hide, Img } from "components/generic/charts/ChartComponents"
import ArrowUp from "utils/arrowUp.svg"
import ArrowDown from "utils/arrowDown.svg"
import Star from "components/generic/icons/Star"
import { postUserConfig } from "api/ApiCalls"
import { useAuth } from "context/AuthContext"
import { FavoriteType } from "components/account/favorites/Favorites"

const ProjectInfo = (props: { project: ProjectType }) => {
  const { project } = props
  const { isMobile } = useData()
  const { user, updateUser, isLoggedIn } = useAuth()
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false)

  useEffect(() => {
    const isInfoOpen = JSON.parse(localStorage.getItem("projectInfo") || "true")

    setIsDescriptionVisible(isInfoOpen)
  }, [project.project_id])

  const toggleIsInfoOpen = () => {
    localStorage.setItem("projectInfo", JSON.stringify(!isDescriptionVisible))

    setIsDescriptionVisible(!isDescriptionVisible)
  }

  const handleStarClick = () => {
    const prevConfig = user.config ? user.config : {}
    const prevFavorites: { id: string; name: string }[] =
      prevConfig.favorites?.projects || []
    let newFavorites = []
    if (
      prevFavorites.findIndex((item) => item.id === project.project_id) !== -1
    ) {
      newFavorites = prevFavorites.filter(
        (item) => item.id !== project.project_id
      )
    } else {
      newFavorites = [
        ...prevFavorites,
        { id: project.project_id, name: project.name },
      ]
    }

    const newConfig = {
      ...prevConfig,
      favorites: { ...prevConfig.favorites, projects: newFavorites },
    }

    postUserConfig(newConfig).then((res) => {
      updateUser({ ...user, config: newConfig })
    })
  }

  const favorites =
    user.config?.favorites?.projects?.map((p: FavoriteType) => p.id) || []

  const isHome = window.location.pathname === "/"

  return (
    <Container isHome={isHome}>
      <Header>
        <ProjectImg
          src={"https://d2kyooqkgm9ipp.cloudfront.net/" + project.logo}
          alt="logo"
        />
        <div
          style={{
            justifyContent: "space-between",
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <ProjectName>
            {project.name}
            {project.symbol && (
              <ProjectSymbol>{"(" + project.symbol + ")"}</ProjectSymbol>
            )}
            {isLoggedIn && (
              <Star
                isSelected={favorites.includes(project.project_id)}
                onClick={handleStarClick}
              />
            )}
          </ProjectName>
          <Hide style={{ marginLeft: "10px" }} onClick={toggleIsInfoOpen}>
            {isDescriptionVisible ? "Hide info" : "Show info"}
            <Img
              src={isDescriptionVisible ? ArrowUp : ArrowDown}
              alt="Toggle visibility"
            />
          </Hide>
        </div>
      </Header>
      <Wrapper>
        <PriceDetails project={project} />
        <ContentsSection>
          {isMobile ? (
            <ProjectDetailsMobile project={project} />
          ) : (
            <ProjectDetails project={project} />
          )}
          <MarketsWrapper>
            <DataColumnTitle>
              <Tooltip id="project-markets">{"Markets"}</Tooltip>
            </DataColumnTitle>
            <ExchangeButtonContainer>
              {AVAILABLE_EXCHANGES.map((availableExchange) => {
                const foundExchange = project.exchanges?.find((exchange:any) =>
                  isEqual(exchange.name, availableExchange)
                )
                return (
                  <ExchangeButton
                    available={foundExchange ? true : false}
                    key={foundExchange ? foundExchange.name : availableExchange}
                  >
                    {foundExchange?.name || availableExchange}
                  </ExchangeButton>
                )
              })}
            </ExchangeButtonContainer>
          </MarketsWrapper>
        </ContentsSection>
      </Wrapper>
      {isDescriptionVisible && (
        <ProjectDescriptionContainer style={{ display: "flex" }}>
          <ProjectDescription
            imgPostFix="project-service.svg"
            title={`What is ${project.name}`}
            text={project.description.what || "N/A."}
          />
          <ProjectDescription
            imgPostFix="project-funding.svg"
            title="How does it work"
            text={project.description.how || "N/A."}
          />
          <ProjectDescription
            imgPostFix="project-competition.svg"
            title={`Who owns ${project.name}`}
            text={project.description.who || "N/A."}
          />
        </ProjectDescriptionContainer>
      )}
    </Container>
  )
}

export default ProjectInfo

const Container = styled.div<{ isHome: boolean }>`
  display: flex;
  flex-direction: column;
`

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const ProjectName = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
`

const ProjectSymbol = styled(ProjectName)`
  opacity: 0.5;
  margin-left: 4px;
`

const ProjectDescriptionContainer = styled.div`
  padding: 4px 40px;
  border-top: 1px solid ${borderColor};

  @media (max-width: 720px) {
    padding: 16px;
  }
`

const ExchangeButtonContainer = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  flex-wrap: wrap;

  @media (max-width: 720px) {
    justify-content: flex-start;
  }
`

const ExchangeButton = styled.div<{ available: boolean }>`
  font-size: 11px;

  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  background-color: transparent;
  color: ${(props) => (props.available ? "#00CF9D" : "#BFBFBF")};
  border: 1px solid ${(props) => (props.available ? "#00CF9D" : "#BFBFBF")};
  margin-left: 8px;
  width: 80px;
  height: 22px;
  margin-bottom: 8px;

  &:hover {
    background-color: ${(props) => (props.available ? "#00CF9D" : "#BFBFBF")};
    color: #ffffff;
  }

  @media (max-width: 720px) {
    margin-left: 0px;
    margin-right: 8px;
  }
`

const MarketsWrapper = styled.div`
  padding: 8px 40px 0px 40px;
  width: -webkit-fill-available;
  display: inline-grid;
  border-top: 1px solid ${borderColor};

  @media (max-width: 720px) {
    padding: 8px 16px;
  }
`
