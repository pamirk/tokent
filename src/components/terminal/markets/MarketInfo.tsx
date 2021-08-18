import React from "react"

import {
  getColor,
  getLabelForPercentage,
  getLabelForPrice,
  getLabelForX,
} from "helpers/numerals"
import { MarketType } from "types/ApiTypes"
import RevenueIcon from "utils/revenue.svg"
import RevenueLightIcon from "utils/revenue-light.svg"
import {
  Container,
  Wrapper,
  ContentsDataColumn,
  ContentsSection,
  Header,
  ProjectImg,
  Title,
  TitleSection,
  ContentsContainer,
} from "components/generic/terminal/Info"
import { useTheme } from "context/ThemeContext"
import Tooltip from "components/generic/tooltip/Tooltip"
import { useAuth } from "context/AuthContext"
import { postUserConfig } from "api/ApiCalls"
import Star from "components/generic/icons/Star"
import { FavoriteType } from "components/account/favorites/Favorites"

const MarketInfo = (props: { data?: MarketType; marketId?: string }) => {
  const { data, marketId } = props
  const { user, updateUser, isLoggedIn } = useAuth()

  const { mode } = useTheme()

  if (!marketId || !data) return null

  const handleStarClick = () => {
    const prevConfig = user.config ? user.config : {}
    const prevFavorites: { id: string; name: string }[] =
      prevConfig.favorites?.markets || []
    let newFavorites = []
    if (prevFavorites.findIndex((item) => item.id === marketId) !== -1) {
      newFavorites = prevFavorites.filter((item) => item.id !== marketId)
    } else {
      newFavorites = [...prevFavorites, { id: marketId, name: data.market }]
    }

    const newConfig = {
      ...prevConfig,
      favorites: { ...prevConfig.favorites, markets: newFavorites },
    }

    postUserConfig(newConfig).then((res) => {
      updateUser({ ...user, config: newConfig })
    })
  }

  const favorites =
    user.config?.favorites?.markets?.map((m: FavoriteType) => m.id) || []

  return (
    <Container>
      <Wrapper>
        <TitleSection style={{ border: "unset" }}>
          <Header style={{ borderBottom: "unset" }}>
            <ProjectImg
              src={mode === "light" ? RevenueIcon : RevenueLightIcon}
              alt="Logo"
            />
            <Tooltip id="markets-title" projectId={marketId?.toLowerCase()}>
              <Title>{`${data.market}`}</Title>
            </Tooltip>
            {isLoggedIn && (
              <Star
                isSelected={favorites.includes(marketId)}
                onClick={handleStarClick}
              />
            )}
          </Header>
        </TitleSection>
        <ContentsSection>
          <ContentsContainer style={{ border: "unset" }}>
            <ContentsDataColumn
              title={`Total ${marketId} revenue`}
              text={getLabelForPrice(data?.revenue_total)}
              tooltipId="markets-total-revenue"
              projectId={marketId?.toLowerCase()}
            />
            <ContentsDataColumn
              title={`${data.project} dominance`}
              text={getLabelForPercentage(data?.project_dominance)}
              textColor={getColor(data?.project_dominance)}
              tooltipId="markets-dominance"
              projectId={marketId?.toLowerCase()}
            />
            <ContentsDataColumn
              title={`Median ${marketId} revenue`}
              text={getLabelForPrice(data?.revenue_median)}
              tooltipId="markets-median-revenue"
              projectId={marketId?.toLowerCase()}
            />
            <ContentsDataColumn
              title={`Median ${marketId} P/S ratio`}
              text={getLabelForX(data?.ps_median)}
              tooltipId="markets-total-ps"
              projectId={marketId?.toLowerCase()}
            />
          </ContentsContainer>
        </ContentsSection>
      </Wrapper>
    </Container>
  )
}

export default MarketInfo
