import {
  ContentsDataColumn,
  getGMVTitle,
} from "components/generic/terminal/Info"
import {
  getLabelForPrice,
  getLabelForPercentage,
  getColor,
  getLabelForX,
} from "helpers/numerals"
import React, { useState } from "react"
import styled from "styled-components"
import { ProjectType } from "types/ApiTypes"

import ArrowUp from "utils/arrowUp.svg"
import ArrowDown from "utils/arrowDown.svg"
import { borderColor, titleColor, titleWrapperColor } from "context/theme"

type Props = { project: ProjectType }
export const ProjectDetailsMobile = (props: Props) => {
  const { project } = props
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          padding: "20px 16px",
          width: "calc(100% - 32px)",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <ContentsDataColumn
          title="Total revenue 30d"
          text={getLabelForPrice(project.revenue_30d)}
          percentage={getLabelForPercentage(project.revenue_30d_change)}
          percentageColor={getColor(project.revenue_30d_change)}
          tooltipId="project-revenue-30d"
          projectId={project.project_id}
        />
        <ContentsDataColumn
          title="Annualized revenue"
          text={getLabelForPrice(project.revenue_annualized)}
          tooltipId="project-revenue-annualized"
          projectId={project.project_id}
        />
      </div>
      <Show onClick={() => setIsOpen(!isOpen)}>
        <span style={{ marginLeft: "20px", marginRight: "10px" }}>
          {isOpen ? "Show less" : "Show more"}
        </span>
        <Img src={isOpen ? ArrowUp : ArrowDown} alt="Toggle visibility" />
      </Show>
      {isOpen && (
        <div
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            padding: "20px 16px",
            width: "calc(100% - 32px)",
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <ContentsDataColumn
            title="Circulating market cap"
            text={getLabelForPrice(project.market_cap_circulating)}
            tooltipId="project-marketcap"
            projectId={project.project_id}
          />
          <ContentsDataColumn
            title="Fd. market cap"
            text={getLabelForPrice(project.market_cap_fully_diluted)}
            tooltipId="project-fully-diluted"
            projectId={project.project_id}
          />
          <ContentsDataColumn
            title="Total revenue 7d"
            text={getLabelForPrice(project.revenue_7d)}
            tooltipId="project-revenue-7d"
            projectId={project.project_id}
          />

          <ContentsDataColumn
            title="Total value locked"
            text={getLabelForPrice(project.tvl)}
            tooltipId="project-tvl"
            projectId={project.project_id}
          />

          <ContentsDataColumn
            title={getGMVTitle(project)}
            text={getLabelForPrice(project.gmv_annualized)}
          />

          <ContentsDataColumn
            title="P/S ratio"
            text={getLabelForX(project.ps)}
            percentage={getLabelForPercentage(project.ps_30d_change || 0 * -1)}
            percentageColor={getColor(
              project.ps_30d_change ? project.ps_30d_change * -1 : 0
            )}
            tooltipId="project-ps"
            projectId={project.project_id}
          />
          <ContentsDataColumn
            title="P/E ratio"
            text={getLabelForX(project.pe)}
            tooltipId="project-pe"
            projectId={project.project_id}
            percentage={getLabelForPercentage(project.pe_30d_change)}
            percentageColor={getColor(
              project.pe_30d_change ? project.pe_30d_change * -1 : 0
            )}
          />
        </div>
      )}
    </>
  )
}

const Show = styled.div`
  height: 48px;

  font-family: FKGrotesk-SemiMono;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;

  border-bottom: 1px solid ${borderColor};

  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${titleWrapperColor};

  color: ${titleColor};
`

const Img = styled.img``
