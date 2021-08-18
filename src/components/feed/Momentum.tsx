import { useData } from "context/DataContext"
import React, { useMemo, useState } from "react"
import {
  ItemContainer,
  ItemSubtitle,
  ItemDesc,
  ReadMore,
  TitleWrapper,
} from "./FeedItem"
import LogoSmallIconBlack from "utils/logo/logo-compact.svg"
import LogoSmallIconWhite from "utils/logo/logo-compact-white.svg"
import { useTheme } from "context/ThemeContext"
import styled from "styled-components"
import { orderBy } from "lodash"
import { ProjectType } from "types/ApiTypes"
import {
  getColor,
  getLabelForPercentage,
  getLabelForPrice,
  getLabelForX,
  reverseNumeral,
} from "helpers/numerals"
import {
  borderColor,
  defaultButtonColor,
  defaultButtonTextColor,
  selectedButtonColor,
  selectedButtonTextColor,
} from "context/theme"
import { Link } from "react-router-dom"
import { useCallback } from "react"
import Tooltip from "components/generic/tooltip/Tooltip"

const sortItems = (data: undefined | any[], key: string, asc: "asc" | "desc") =>
  orderBy(
    data,
    [
      (project) => {
        if (!!project[key]) return project[key]

        return asc === "asc" ? Infinity : -Infinity
      },
    ],
    [asc]
  )

type SectionType = {
  path: string
  title: string
  type: "price" | "ratio"
  percentageKey: percentageKeys
  valueKey: valueKeys
}[]

const sections: SectionType = [
  {
    path: "tvl",
    title: "Total value locked (TVL)",
    type: "price",
    percentageKey: "tvl_7d_change",
    valueKey: "tvl",
  },
  {
    path: "revenue",
    title: "Total revenue (fees paid)",
    type: "price",
    percentageKey: "revenue_7d_change",
    valueKey: "revenue_7d",
  },
  {
    path: "ps",
    title: "Price to sales (P/S) ratio",
    type: "ratio",
    percentageKey: "ps_7d_change",
    valueKey: "ps",
  },
  {
    path: "protocol_revenue",
    title: "Protocol revenue",
    type: "price",
    percentageKey: "revenue_protocol_7d_change",
    valueKey: "revenue_protocol_7d",
  },
  {
    path: "pe",
    title: "Price to earnings (P/E) ratio",
    type: "ratio",
    percentageKey: "pe_7d_change",
    valueKey: "pe",
  },
]

const Momentum = () => {
  const { mode } = useTheme()

  const [isOpen, setIsOpen] = useState(false)
  const [showGainers, setShowGainers] = useState(true)

  return (
    <ItemContainer
      style={{ background: mode === "light" ? "#F5FFFC" : "#2D2E2E" }}
    >
      <TitleWrapper>
        <ItemTitle>
          <Logo
            src={mode === "light" ? LogoSmallIconBlack : LogoSmallIconWhite}
          />

          {"Weekly gainers"}
        </ItemTitle>
      </TitleWrapper>
      <div style={{ cursor: "pointer" }} onClick={() => setIsOpen(!isOpen)}>
        <ItemSubtitle>{"Token Terminal’s weekly leaderboard:"}</ItemSubtitle>
        <ItemDesc style={{ marginBottom: "10px" }}>
          {
            "Top 5 blockchains & dapps  across all of our metrics during the past 7 days:"
          }
        </ItemDesc>
      </div>
      {isOpen && (
        <>
          <ButtonRow>
            <Button
              isSelected={showGainers}
              onClick={() => setShowGainers(true)}
            >
              {"Weekly gainers"}
            </Button>
            <Button
              isSelected={!showGainers}
              onClick={() => setShowGainers(false)}
            >
              {"Weekly losers"}
            </Button>
          </ButtonRow>
          {sections.map((section) => (
            <Section
              key={section.title}
              path={section.path}
              title={section.title}
              valueKey={section.valueKey}
              percentageKey={section.percentageKey}
              type={section.type}
              showGainers={showGainers}
            />
          ))}
        </>
      )}
      <ReadMore onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Show less" : "Read more"}
      </ReadMore>
    </ItemContainer>
  )
}

export default Momentum

const ItemTitle = styled.div`
  display: flex;
  align-items: center;

  font-weight: bold;
  font-size: 14px;
  max-width: 80%;

  color: inherit;

  cursor: pointer;
`

type percentageKeys =
  | "tvl_7d_change"
  | "revenue_7d_change"
  | "ps_7d_change"
  | "revenue_protocol_7d_change"
  | "pe_7d_change"

type valueKeys = "tvl" | "revenue_7d" | "ps" | "revenue_protocol_7d" | "pe"

type SectionProps = {
  path: string
  title: string
  percentageKey: percentageKeys
  valueKey: valueKeys
  type: "ratio" | "price"
  showGainers: boolean
}

const Section = (props: SectionProps) => {
  const { projects } = useData()
  const { path, title, percentageKey, valueKey, type, showGainers } = props

  const getColorStyle = (project: ProjectType) =>
    type === "ratio"
      ? getColor(reverseNumeral(project[percentageKey]))
      : getColor(project[percentageKey])

  const getSortDirection = useCallback(() => {
    if (showGainers) {
      return type === "price" ? "desc" : "asc"
    }

    return type === "price" ? "asc" : "desc"
  }, [showGainers, type])

  const data = useMemo(
    () =>
      sortItems(projects, percentageKey, getSortDirection())
        .filter((project) => !!project[valueKey])
        .slice(0, 5),
    [getSortDirection, percentageKey, projects, valueKey]
  )
  return (
    <SectionContainer>
      <Tooltip id={`momentum-${path}`}>
        <SectionTitle to={`/terminal/metrics/${path}`}>{title}</SectionTitle>
      </Tooltip>
      {data.map((project, i) => (
        <SectionItemRow key={project.name}>
          <Index>{`${i + 1}.`}</Index>
          <ItemLink to={`/terminal/projects/${project.project_id}`}>
            {project.name}
          </ItemLink>
          <Item style={{ textAlign: "end" }}>
            {type === "price"
              ? getLabelForPrice(project[valueKey])
              : getLabelForX(project[valueKey])}
          </Item>
          <Item style={getColorStyle(project)}>
            {getLabelForPercentage(project[percentageKey])}
          </Item>
        </SectionItemRow>
      ))}
    </SectionContainer>
  )
}

const SectionContainer = styled.div`
  font-size: 12px;

  padding: 10px 0px;
  border-top: 1px solid ${borderColor};
`

const SectionTitle = styled(Link)`
  font-weight: bold;
  color: inherit;

  line-height: 20px;

  &:hover {
    opacity: 0.8;
  }

  ::selection {
    background: #c7efe3;
  }
  ::-moz-selection {
    background: #c7efe3;
  }
`

const SectionItemRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  color: #858585;
  line-height: 18px;

  ::selection {
    background: #c7efe3;
  }
  ::-moz-selection {
    background: #c7efe3;
  }
`

const Index = styled.div`
  font-weight: bold;

  ::selection {
    background: #c7efe3;
  }
  ::-moz-selection {
    background: #c7efe3;
  }
`

const Item = styled.div`
  flex: 2;
  margin-left: 5px;

  &:last-of-type {
    text-align: end;
  }

  ::selection {
    background: #c7efe3;
  }
  ::-moz-selection {
    background: #c7efe3;
  }
`

const Logo = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 24px;
`

const ItemLink = styled(Link)`
  flex: 3;
  color: inherit;
  margin-left: 5px;

  &:hover {
    opacity: 0.8;
  }

  ::selection {
    background: #c7efe3;
  }
  ::-moz-selection {
    background: #c7efe3;
  }
`

const Button = styled.div<{ isSelected: boolean }>`
  cursor: pointer;
  padding: 4px 8px;
  font-family: FKGrotesk-SemiMono;
  font-size: 11px;
  border: 1px solid;

  background: ${(props) =>
    props.isSelected ? selectedButtonColor : defaultButtonColor};
  color: ${(props) =>
    props.isSelected ? selectedButtonTextColor : defaultButtonTextColor};
  @media (max-width: 720px) {
    margin: 8px 8px 0px 0px;
  }

  &:first-of-type {
    margin-right: 5px;
  }

  &:${' '}hover  {
    opacity: 0.8;
  }
`

const ButtonRow = styled.div`
  display: flex;
  width: 100%;

  margin-bottom: 10px;
`
