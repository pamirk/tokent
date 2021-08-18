import React from "react"

import {
  getColor,
  getLabelForPercentage,
  getLabelForPrice,
} from "helpers/numerals"
import { RevenueInfoType } from "types/ApiTypes"
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

const RevenueInfo = (props: { data?: RevenueInfoType }) => {
  const { data } = props
  const { user, updateUser, isLoggedIn } = useAuth()
  const { mode } = useTheme()

  if (!data) return <></>

  const defi = data.find((entry) => entry.category === "DeFi")
  const blockchain = data.find((entry) => entry.category === "Blockchain")

  return (
    <Container>
      <Wrapper>
        <TitleSection style={{ border: "unset" }}>
          <Header style={{ borderBottom: "unset" }}>
            <ProjectImg
              src={mode === "light" ? RevenueIcon : RevenueLightIcon}
              alt="Logo"
            />
            <Tooltip id="metrics-title" projectId="revenue">
              <Title>{"Total revenue"}</Title>
            </Tooltip>
            {isLoggedIn && (
              <Star
                isSelected={getMetricFavorites(user).includes("revenue")}
                onClick={() =>
                  handleMetricStarClick(
                    "revenue",
                    "Total revenue",
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
              title="Total dapp revenue"
              text={getLabelForPrice(defi?.revenue_total)}
              tooltipId="metrics-total-revenue-defi"
            />
            <ContentsDataColumn
              title={`${defi?.project} dominance`}
              text={getLabelForPercentage(defi?.project_dominance)}
              textColor={getColor(defi?.project_dominance)}
              tooltipId="metrics-revenue-dominance-defi"
            />
            <ContentsDataColumn
              title="Total blockchain revenue"
              text={getLabelForPrice(blockchain?.revenue_total)}
              tooltipId="metrics-total-revenue-blockchain"
            />
            <ContentsDataColumn
              title={`${blockchain?.project} dominance`}
              text={getLabelForPercentage(blockchain?.project_dominance)}
              textColor={getColor(blockchain?.project_dominance)}
              tooltipId="metrics-total-revenue-blockchain"
            />
          </ContentsContainer>
        </ContentsSection>
      </Wrapper>
    </Container>
  )
}

export default RevenueInfo
