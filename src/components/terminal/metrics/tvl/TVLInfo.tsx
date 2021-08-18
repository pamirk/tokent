import React from "react"

import {
  getColor,
  getLabelForPercentage,
  getLabelForPrice,
} from "helpers/numerals"
import { TVLInfoType } from "types/ApiTypes"
import RevenueIcon from "utils/revenue.svg"
import RevenueLightIcon from "utils/revenue-light.svg"
import {
  Container,
  ContentsContainer,
  ContentsDataColumn,
  ContentsSection,
  Header,
  ProjectImg,
  Title,
  TitleSection,
  Wrapper,
} from "components/generic/terminal/Info"
import { useTheme } from "context/ThemeContext"
import Tooltip from "components/generic/tooltip/Tooltip"
import { useAuth } from "context/AuthContext"
import Star from "components/generic/icons/Star"
import { getMetricFavorites, handleMetricStarClick } from "../metricHelpers"

const TVLInfo = (props: { data?: TVLInfoType; title: string }) => {
  const { data, title } = props
  const { user, updateUser, isLoggedIn } = useAuth()
  const { mode } = useTheme()

  if (!data) return <></>

  const defi = data.find((entry:any) => entry.category === "DeFi")

  return (
    <Container>
      <Wrapper>
        <TitleSection style={{ border: "unset" }}>
          <Header style={{ borderBottom: "unset" }}>
            <ProjectImg
              src={mode === "light" ? RevenueIcon : RevenueLightIcon}
              alt="Logo"
            />
            <Tooltip id="metrics-title" projectId="tvl">
              <Title>{title}</Title>
            </Tooltip>
            {isLoggedIn && (
              <Star
                isSelected={getMetricFavorites(user).includes("tvl")}
                onClick={() =>
                  handleMetricStarClick(
                    "tvl",
                    "Total value locked (TVL)",
                    user,
                    updateUser
                  )
                }
              />
            )}
          </Header>
        </TitleSection>
        <ContentsSection>
          <ContentsContainer style={{ border: "unset" }}>
            <ContentsDataColumn
              title="Total dapp TVL"
              text={getLabelForPrice(defi?.tvl_total)}
              tooltipId="metrics-total-tvl-defi"
            />

            <ContentsDataColumn
              title={`${defi?.project} dominance`}
              text={getLabelForPercentage(defi?.project_dominance)}
              textColor={getColor(defi?.project_dominance)}
              tooltipId="metrics-tvl-dominance"
            />
            <ContentsDataColumn
              title="Highest dapp TVL"
              text={getLabelForPrice(defi?.tvl_highest)}
              tooltipId="metrics-tvl-highest"
            />
            <ContentsDataColumn
              title="Lowest dapp TVL"
              text={getLabelForPrice(defi?.tvl_lowest)}
              tooltipId="metrics-tvl-lowest"
            />
          </ContentsContainer>
        </ContentsSection>
      </Wrapper>
    </Container>
  )
}

export default TVLInfo
