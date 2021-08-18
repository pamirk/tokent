import React from "react"

import { getLabelForX } from "helpers/numerals"
import { PSInfoType } from "types/ApiTypes"
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
import Star from "components/generic/icons/Star"
import { getMetricFavorites, handleMetricStarClick } from "../metricHelpers"
import { useAuth } from "context/AuthContext"

const PSInfo = (props: { data?: PSInfoType; title: string }) => {
  const { data, title } = props
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
            <Tooltip id="metrics-title" projectId="ps">
              <Title>{title}</Title>
            </Tooltip>
            {isLoggedIn && (
              <Star
                isSelected={getMetricFavorites(user).includes("pe")}
                onClick={() =>
                  handleMetricStarClick(
                    "ps",
                    "Price to sales (P/S) ratio",
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
              title="Highest dapp P/S ratio"
              text={getLabelForX(defi?.ps_highest)}
              tooltipId="metrics-highest-ps-defi"
            />
            <ContentsDataColumn
              title="Lowest dapp P/S ratio"
              text={getLabelForX(defi?.ps_lowest)}
              tooltipId="metrics-lowest-ps-defi"
            />
            <ContentsDataColumn
              title="Highest blockchain P/S ratio"
              text={getLabelForX(blockchain?.ps_highest)}
              tooltipId="metrics-highest-ps-blockchain"
            />
            <ContentsDataColumn
              title="Lowest blockchain P/S ratio"
              text={getLabelForX(blockchain?.ps_lowest)}
              tooltipId="metrics-lowest-ps-blockchain"
            />
          </ContentsContainer>
        </ContentsSection>
      </Wrapper>
    </Container>
  )
}

export default PSInfo
