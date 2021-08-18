import { useSocket } from "context/SocketContext"
import { borderColor, dataColumnTextColor, titleColor } from "context/theme"
import {
  ColorStyle,
  getColor,
  getFullLabelForPrice,
  getLabelForPercentage,
} from "helpers/numerals"
import React from "react"
import styled from "styled-components"
import { ProjectType } from "types/ApiTypes"
import useColorChange from "use-color-change"
import Tooltip from "../tooltip/Tooltip"

export const DataColumnContainer = styled.div`
  display: flex;
  padding: 8px 0px;
  margin-left: 40px;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  letter-spacing: 0.44px;
  min-width: 130px;
  justify-content: center;

  @media (max-width: 720px) {
    align-items: flex-start;
    margin-left: 0px;
  }
`

export const DataColumnTitle = styled.span`
  font-size: 11px;
  line-height: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  letter-spacing: 0.44px;

  margin-bottom: 6px;

  color: ${dataColumnTextColor};
  opacity: 0.3;
  font-weight: bolder;

  @media (max-width: 720px) {
    justify-content: flex-start;
  }
`

export const DataColumnText = styled.span`
  font-weight: 500;
  font-size: 11px;
  line-height: 100%;

  display: flex;
  align-items: center;
  text-align: right;
  letter-spacing: 0.44px;

  color: ${dataColumnTextColor};
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${borderColor};
`

export const ContentsSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  align-items: flex-end;

  @media (max-width: 720px) {
    align-items: flex-start;
  }
`

export const Title = styled.div`
  text-align: center;
  font-family: FKGrotesk-SemiMono;
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 24px;

  color: ${titleColor};
`

export const Header = styled.div`
  font-family: FKGrotesk-SemiMono;
  font-style: normal;
  font-weight: normal;
  font-size: 19px;
  line-height: 24px;

  display: flex;
  align-items: center;
  border-bottom: 1px solid ${borderColor};
  padding: 8px 32px;

  @media (max-width: 720px) {
    font-size: 19px;
    line-height: 100%;
    padding: 13px 16px;
  } ;
`

export const ProjectImg = styled.img<{ size?: string }>`
  width: 30px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
  padding: 1px;
`

export const ContentsDataColumn = (props: {
  title: string
  text?: string
  textColor?: ColorStyle
  percentage?: string
  percentageColor?: ColorStyle
  tooltipId?: string
  projectId?: string
  children?: React.ReactNode
}) => {
  const {
    title,
    text,
    textColor,
    percentage,
    tooltipId,
    projectId,
    percentageColor,
    children,
  } = props
  return (
    <DataColumnContainer>
      <DataColumnTitle>
        <Tooltip projectId={projectId} id={tooltipId}>
          {title}
        </Tooltip>
      </DataColumnTitle>
      <div style={{ display: "inline-flex" }}>
        {text && <DataColumnText style={textColor}>{text}</DataColumnText>}
        {percentage && percentage !== "-" && (
          <DataColumnText style={{ ...percentageColor, marginLeft: "5px" }}>
            ({percentage})
          </DataColumnText>
        )}
      </div>
      {children}
    </DataColumnContainer>
  )
}

export const PriceDetails = ({ project }: { project: ProjectType }) => {
  const { priceMap } = useSocket()

  const price = priceMap[project.project_id]?.usd || project.price

  const colorStyle = useColorChange(price || 0, {
    higher: "green",
    lower: "crimson",
    duration: 5000,
  })

  return (
    <PriceSection>
      <Price style={colorStyle}>{getFullLabelForPrice(price)}</Price>
      <PriceChange>
        <PriceKey>{"24h: "}</PriceKey>
        <span style={getColor(project.price_24h_change)}>
          {getLabelForPercentage(project.price_24h_change)}
        </span>
        <PriceKey>{"7d: "}</PriceKey>
        <span style={getColor(project.price_7d_change)}>
          {getLabelForPercentage(project.price_7d_change)}
        </span>
      </PriceChange>
      <PriceChange>
        <PriceKey>{"30d: "}</PriceKey>
        <span style={getColor(project.price_30d_change)}>
          {getLabelForPercentage(project.price_30d_change)}
        </span>
        <PriceKey>{"180d: "}</PriceKey>
        <span style={getColor(project.price_180d_change)}>
          {getLabelForPercentage(project.price_180d_change)}
        </span>
      </PriceChange>
      <PriceChange style={{ marginTop: "25px" }}>
        <Tooltip projectId={project.project_id} id="project-ath">
          <ATHATL>{"ATH: "}</ATHATL>
        </Tooltip>
        <ATHATLPrice>{getFullLabelForPrice(project.price_ath)}</ATHATLPrice>
        <Tooltip projectId={project.project_id} id="project-atl">
          <ATHATL>{"ATL: "}</ATHATL>
        </Tooltip>
        <ATHATLPrice>{getFullLabelForPrice(project.price_atl)}</ATHATLPrice>
      </PriceChange>
    </PriceSection>
  )
}

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px 32px;
  border-right: 1px solid ${borderColor};

  @media (max-width: 720px) {
    padding: 10px 16px;
  }
`

const PriceChange = styled.div`
  display: flex;
  margin-top: 4px;
  align-items: center;

  & > span:nth-child(even) {
    margin-right: 16px;
    min-width: 48px;
    font-weight: normal;
  }
`

const PriceKey = styled.span`
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 140%;
  margin-right: 8px;
`

const ATHATL = styled.span`
  font-style: normal;
  font-weight: bolder;
  font-size: 13px;
  line-height: 24px;
  margin-right: 8px;

  color: ${dataColumnTextColor};
  opacity: 0.3;
`

const ATHATLPrice = styled.span`
  font-size: 13px;
`

export const getGMVTitle = (project: ProjectType) => {
  if (project.category_tags.includes("Lending")) {
    return "Annualized borrowing vol."
  } else if (
    project.category_tags.includes("Exchange") ||
    project.category_tags.includes("Prediction Market")
  ) {
    return "Annualized trading vol."
  } else if (project.category_tags.includes("Asset Management")) {
    return "Annualized capital depl."
  }
  return "Annualized transaction vol."
}

export const ContentsContainer = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding: 8px 32px;
  border-bottom: 1px solid ${borderColor};

  @media (max-width: 720px) {
    padding: 24px 16px 4px;
  }
`

const Price = styled.div`
  padding: 10px 0px;
  font-size: 18px;
  font-weight: bold;
`
