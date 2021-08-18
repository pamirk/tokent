import { postUserConfig } from "api/ApiCalls"
import Star from "components/generic/icons/Star"
import OverviewTable from "components/home/overview/overviewTable/OverviewTable"
import { useAuth } from "context/AuthContext"
import { useData } from "context/DataContext"
import { borderColor } from "context/theme"
import { sortBy } from "lodash"
import React, { useState } from "react"
import styled from "styled-components"
import { OptionType } from "types/Types"
import AccountSectionTitle from "../AccountSectionTitle"

export type FavoriteType = { id: string; name: string }
export type FavoriteTableType = {
  id: string
  name: string
  items: OptionType[]
}
const Favorites = () => {
  const { user, updateUser } = useAuth()
  const { projects } = useData()

  const [isOpen, setIsOpen] = useState(true)
  const [hoverId, setHoverId] = useState<string | undefined>(undefined)
  const favProjects: FavoriteType[] = user.config?.favorites?.projects || []
  const favMarkets: FavoriteType[] = user.config?.favorites?.markets || []
  const favMetrics: FavoriteType[] = user.config?.favorites?.metrics || []
  const favTables: FavoriteTableType[] = user.config.favorites?.tables || []

  const hasFavorites =
    favProjects.length > 0 ||
    favMarkets.length > 0 ||
    favMetrics.length > 0 ||
    favTables.length > 0

  const handleStarClick = (id: string, type: string) => {
    const prevConfig = user.config ? user.config : {}
    const prevFavorites: FavoriteType[] = prevConfig.favorites?.[type] || []

    const newFavorites = prevFavorites.filter((item) => item.id !== id)
    const newConfig = {
      ...prevConfig,
      favorites: { ...prevConfig.favorites, [type]: newFavorites },
    }

    postUserConfig(newConfig).then((res) => {
      updateUser({ ...user, config: newConfig })
    })
  }

  const getFullFavoriteProjects = () => {
    const favProjectIds = favProjects.map((p) => p.id)

    return projects?.filter((p) => favProjectIds.includes(p.project_id))
  }

  const renderContent = (data: FavoriteType[], type: string) => {
    return data.map((p) => (
      <ItemWrapper
        key={p.id}
        onMouseEnter={() => setHoverId(p.id)}
        onMouseLeave={() => setHoverId(undefined)}
      >
        <Star
          isSelected
          onClick={() => handleStarClick(p.id, type)}
          showNotification={false}
        />
        <Text href={`/terminal/${type}/${p.id}`} target="_blank">
          {p.name}
        </Text>
        {hoverId === p.id && (
          <RemoveText onClick={() => handleStarClick(p.id, type)}>
            {"Remove"}
          </RemoveText>
        )}
      </ItemWrapper>
    ))
  }

  return (
    <Container>
      <AccountSectionTitle
        title="Favorites"
        isOpen={isOpen}
        toggleIsOpen={() => setIsOpen(!isOpen)}
      />
      {isOpen && hasFavorites && (
        <Contents>
          {(favMetrics.length > 0 || favMarkets.length > 0) && (
            <Section>
              <Title>{"Metrics & Markets:"}</Title>
              {renderContent(favMetrics, "metrics")}
              {renderContent(favMarkets, "markets")}
            </Section>
          )}

          {favProjects.length > 0 && (
            <Section>
              <Title>{"Projects:"}</Title>
              {renderContent(sortBy(favProjects, "name"), "projects")}
            </Section>
          )}

          {favTables.length > 0 && (
            <Section>
              <Title>{"Custom data tables:"}</Title>
              {renderContent(favTables, "tables")}
            </Section>
          )}
        </Contents>
      )}
      {isOpen && !hasFavorites && (
        <Contents>
          <NoFavoritesText>
            {
              "Save your favorite dashboards and projects by clicking on the star in the dashboard. The projects you have saved will also appear in the data table below."
            }
          </NoFavoritesText>
        </Contents>
      )}
      <OverviewTable
        customProjects={getFullFavoriteProjects()}
        showButtons={false}
      />
    </Container>
  )
}

export default Favorites

const Container = styled.div`
  border-top: 1px solid ${borderColor};
`

const NoFavoritesText = styled.div``
const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;

  &:hover {
    background: rgba(67, 255, 108, 0.09);
  }
`

const Section = styled.div`
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0px;
  }
`

const Text = styled.a`
  color: inherit;
  margin-left: 5px;
  font-size: 14px;
`

const RemoveText = styled.div`
  float: right;
  margin-left: auto;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    opacity: 0.8;
  }
`

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 3px;
  margin-top: 5px;
`
const Contents = styled.div`
  padding: 40px;
`
