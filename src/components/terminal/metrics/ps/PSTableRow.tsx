import React, { useState } from "react"

import { ProjectType } from "types/ApiTypes"
import {
  getLabelForPrice,
  getLabelForPercentage,
  getColor,
  getLabelForX,
  reverseNumeral,
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

const PSTableRow = (props: {
  project: ProjectType
  customOptions: OptionType[]
}) => {
  const { project, customOptions } = props
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { isMobile } = useData()
  const { priceMap } = useSocket()

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
        <TableRowColumn>
          {getLabelForPrice(project.revenue_annualized)}
        </TableRowColumn>
        <TableRowColumn>{getLabelForX(project.ps)}</TableRowColumn>
        <TableRowColumn style={getColor(reverseNumeral(project.ps_24h_change))}>
          {getLabelForPercentage(project.ps_24h_change)}
        </TableRowColumn>
        <TableRowColumn style={getColor(reverseNumeral(project.ps_7d_change))}>
          {getLabelForPercentage(project.ps_7d_change)}
        </TableRowColumn>
        <TableRowColumn style={getColor(reverseNumeral(project.ps_30d_change))}>
          {getLabelForPercentage(project.ps_30d_change)}
        </TableRowColumn>
        <TableRowColumn style={getColor(reverseNumeral(project.ps_90d_change))}>
          {getLabelForPercentage(project.ps_90d_change)}
        </TableRowColumn>
        <TableRowColumn
          style={getColor(reverseNumeral(project.ps_180d_change))}
        >
          {getLabelForPercentage(project.ps_180d_change)}
        </TableRowColumn>
      </TableRowContainer>
      {isOpen && !isMobile && <RowContents project={project} />}
    </div>
  )
}

export default PSTableRow
