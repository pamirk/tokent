import React, { useState } from "react"

import { ProjectType } from "types/ApiTypes"
import {
  getLabelForPrice,
  getLabelForPercentage,
  getLabelForX,
  getColor,
} from "helpers/numerals"
import {
  SmallLogo,
  TableRowColumn,
  TableRowContainer,
} from "components/generic/table/Table"
import RowContents from "components/home/overview/overviewTable/OverviewTableRowContents"
import {
  createCustomTableRows,
  OptionType,
} from "components/generic/table/tableUtils"
import { useData } from "context/DataContext"
import useColorChange from "use-color-change"
import { useSocket } from "context/SocketContext"

const RevenueTableRow = (props: {
  project: ProjectType
  customOptions: OptionType[]
}) => {
  const { project, customOptions } = props
  const { isMobile } = useData()
  const { priceMap } = useSocket()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const price = priceMap[project.project_id]?.usd || project.price
  const colorStyle = useColorChange(price || 0, {
    higher: "green",
    lower: "crimson",
    duration: 5000,
  })

  if (customOptions.length > 0) {
    return (
      <div key={project.name}>
        <TableRowContainer
          onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
        >
          <TableRowColumn>
            <SmallLogo
              src={"https://d2kyooqkgm9ipp.cloudfront.net/" + project.logo}
              alt="Logo"
            />
            {project.name}
          </TableRowColumn>
          {createCustomTableRows(project, customOptions, price, colorStyle)}
        </TableRowContainer>
        {isOpen && !isMobile && <RowContents project={project} />}
      </div>
    )
  }
  return (
    <div key={project.name}>
      <TableRowContainer onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}>
        <TableRowColumn>
          <SmallLogo
            src={"https://d2kyooqkgm9ipp.cloudfront.net/" + project.logo}
            alt="Logo"
          />
          {project.name}
        </TableRowColumn>
        <TableRowColumn>{getLabelForPrice(project.market_cap)}</TableRowColumn>
        <TableRowColumn>{getLabelForPrice(project.revenue_24h)}</TableRowColumn>
        <TableRowColumn>{getLabelForPrice(project.revenue_7d)}</TableRowColumn>
        <TableRowColumn>{getLabelForPrice(project.revenue_30d)}</TableRowColumn>
        <TableRowColumn>
          {getLabelForPrice(project.revenue_180d)}
        </TableRowColumn>
        <TableRowColumn style={getColor(project.revenue_24h_change)}>
          {getLabelForPercentage(project.revenue_24h_change)}
        </TableRowColumn>
        <TableRowColumn style={getColor(project.revenue_7d_change)}>
          {getLabelForPercentage(project.revenue_7d_change)}
        </TableRowColumn>
        <TableRowColumn style={getColor(project.revenue_30d_change)}>
          {getLabelForPercentage(project.revenue_30d_change)}
        </TableRowColumn>
        <TableRowColumn style={getColor(project.revenue_180d_change)}>
          {getLabelForPercentage(project.revenue_180d_change)}
        </TableRowColumn>
        <TableRowColumn>{getLabelForX(project.ps)}</TableRowColumn>
      </TableRowContainer>
      {isOpen && !isMobile && <RowContents project={project} />}
    </div>
  )
}

export default RevenueTableRow
