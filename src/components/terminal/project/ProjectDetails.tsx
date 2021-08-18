import {
  ContentsDataColumn,
  getGMVTitle,
} from "components/generic/terminal/Info"
import { borderColor } from "context/theme"
import {
  getLabelForPrice,
  getLabelForPercentage,
  getColor,
  getLabelForX,
} from "helpers/numerals"
import { ProjectType } from "types/ApiTypes"

type Props = { project: ProjectType }
export const ProjectDetails = (props: Props) => {
  const { project } = props

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        padding: "10px 32px",
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
      <ContentsDataColumn
        title="Total value locked"
        text={getLabelForPrice(project.tvl)}
        tooltipId="project-tvl"
        projectId={project.project_id}
      />
      <ContentsDataColumn
        title={getGMVTitle(project)}
        text={getLabelForPrice(project.gmv_annualized)}
        tooltipId="project-annualized-transaction-vol"
        projectId={project.project_id}
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
  )
}
