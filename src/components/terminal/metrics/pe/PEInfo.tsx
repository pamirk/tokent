import React from "react"

import { getLabelForX } from "helpers/numerals"
import { PEInfoType } from "types/ApiTypes"
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
import { getMetricFavorites, handleMetricStarClick } from "../metricHelpers"
import { useAuth } from "context/AuthContext"
import Star from "components/generic/icons/Star"

const PEInfo = (props: { data?: PEInfoType; title: string }) => {
  const { data, title } = props
  const { user, updateUser, isLoggedIn } = useAuth()

  const { mode } = useTheme()

  if (!data) return null

  const defi = data.find((entry:any) => entry.category === "DeFi")
  const blockchain = data.find((entry:any) => entry.category === "Blockchain")

  return (
    <Container>
      <Wrapper>
        <TitleSection style={{ border: "unset" }}>
          <Header style={{ borderBottom: "unset" }}>
            <ProjectImg
              src={mode === "light" ? RevenueIcon : RevenueLightIcon}
              alt="Logo"
            />
            <Tooltip id="metrics-title" projectId="pe">
              <Title>{title}</Title>
            </Tooltip>
            {isLoggedIn && (
              <Star
                isSelected={getMetricFavorites(user).includes("pe")}
                onClick={() =>
                  handleMetricStarClick(
                    "pe",
                    "Price to earnings (P/E) ratio",
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
              title="Highest dapp P/E ratio"
              text={getLabelForX(defi?.pe_highest)}
              tooltipId="metrics-highest-pe-defi"
            />
            <ContentsDataColumn
              title="Lowest dapp P/E ratio"
              text={getLabelForX(defi?.pe_lowest)}
              tooltipId="metrics-lowest-pe-defi"
            />
            <ContentsDataColumn
              title="Highest blockchain P/E ratio"
              text={getLabelForX(blockchain?.pe_highest)}
              tooltipId="metrics-highest-pe-blockchain"
            />
            <ContentsDataColumn
              title="Lowest blockchain P/E ratio"
              text={getLabelForX(blockchain?.pe_lowest)}
              tooltipId="metrics-lowest-pe-blockchain"
            />
          </ContentsContainer>
        </ContentsSection>
      </Wrapper>
    </Container>
  )
}

export default PEInfo
