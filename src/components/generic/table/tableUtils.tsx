import {
  getColor,
  getLabelForNumber,
  getLabelForPercentage,
  getLabelForPrice,
  getLabelForX,
  reverseNumeral,
} from "helpers/numerals"
import styled from "styled-components"
import { ProjectType } from "types/ApiTypes"
import { TableRowColumn } from "./Table"
import { ArrowUp } from "utils/components/ArrowUp"
import { ArrowDown } from "utils/components/ArrowDown"
import Customize from "components/generic/icons/Customize"

export type OptionType = { label: string; value: string }

export const marketCapOptions = [
  { label: "Market cap", value: "market_cap" },
  { label: "Market cap circulating", value: "market_cap_circulating" },
  { label: "Market cap fully diluted", value: "market_cap_fully_diluted" },
]

export const priceOptions = [
  { label: "Price", value: "price" },
  { label: "Price 24h change", value: "price_24h_change" },
  { label: "Price 7d change", value: "price_7d_change" },
  { label: "Price 30d change", value: "price_30d_change" },
  { label: "Price 90d change", value: "price_90d_change" },
  { label: "Price 180d change", value: "price_180d_change" },
  { label: "Price ATH", value: "price_ath" },
  { label: "Price ATL", value: "price_atl" },
]

export const psOptions = [
  { label: "P/S", value: "ps" },
  { label: "P/S 24h avg.", value: "ps_24h" },
  { label: "P/S 7d avg.", value: "ps_7d" },
  { label: "P/S 30d avg.", value: "ps_30d" },
  { label: "P/S 90 avg.", value: "ps_90d" },
  { label: "P/S 180d avg.", value: "ps_180d" },
  { label: "P/S 24h change", value: "ps_24h_change" },
  { label: "P/S 7d change", value: "ps_7d_change" },
  { label: "P/S 30d change", value: "ps_30d_change" },
  { label: "P/S 90d change", value: "ps_90d_change" },
  { label: "P/S 180d change", value: "ps_180d_change" },
]

export const peOptions = [
  { label: "P/E", value: "pe" },
  { label: "P/E 24h avg.", value: "pe_24h" },
  { label: "P/E 7d avg.", value: "pe_7d" },
  { label: "P/E 30d avg.", value: "pe_30d" },
  { label: "P/E 90 avg.", value: "pe_90d" },
  { label: "P/E 180d avg.", value: "pe_180d" },
  { label: "P/E 24h change", value: "pe_24h_change" },
  { label: "P/E 7d change", value: "pe_7d_change" },
  { label: "P/E 30d change", value: "pe_30d_change" },
  { label: "P/E 90d change", value: "pe_90d_change" },
  { label: "P/E 180d change", value: "pe_180d_change" },
]

export const revenueOptions = [
  { label: "Revenue 24h", value: "revenue_24h" },
  { label: "Revenue 7d", value: "revenue_7d" },
  { label: "Revenue 30d", value: "revenue_30d" },
  { label: "Revenue 90d", value: "revenue_90d" },
  { label: "Revenue 180d", value: "revenue_180d" },
  { label: "Revenue annualized", value: "revenue_annualized" },

  { label: "Revenue 24h change", value: "revenue_24h_change" },
  { label: "Revenue 7d change", value: "revenue_7d_change" },
  { label: "Revenue 30d change", value: "revenue_30d_change" },
  { label: "Revenue 90d change", value: "revenue_90d_change" },
  { label: "Revenue 180d change", value: "revenue_180d_change" },
]

export const protocolRevenueOptions = [
  { label: "Protocol revenue 24h", value: "revenue_protocol_24h" },
  { label: "Protocol revenue 7d", value: "revenue_protocol_7d" },
  { label: "Protocol revenue 30d", value: "revenue_protocol_30d" },
  { label: "Protocol revenue 90d", value: "revenue_protocol_90d" },
  { label: "Protocol revenue 180d", value: "revenue_protocol_180d" },
  {
    label: "Protocol revenue annualized",
    value: "revenue_protocol_annualized",
  },
  {
    label: "Protocol revenue 24h change",
    value: "revenue_protocol_24h_change",
  },
  { label: "Protocol revenue 7d change", value: "revenue_protocol_7d_change" },
  {
    label: "Protocol revenue 30d change",
    value: "revenue_protocol_30d_change",
  },
  {
    label: "Protocol revenue 90d change",
    value: "revenue_protocol_90d_change",
  },
  {
    label: "Protocol revenue 180d change",
    value: "revenue_protocol_180d_change",
  },
]

export const TVLOptions = [
  { label: "TVL", value: "tvl" },
  { label: "TVL 24h avg.", value: "tvl_24h" },
  { label: "TVL 7d avg.", value: "tvl_7d" },
  { label: "TVL 30d avg.", value: "tvl_30d" },
  { label: "TVL 90d avg.", value: "tvl_90d" },
  { label: "TVL 180d avg.", value: "tvl_180d" },
  { label: "TVL 24h change", value: "tvl_24h_change" },
  { label: "TVL 7d change", value: "tvl_7d_change" },
  { label: "TVL 30d change", value: "tvl_30d_change" },
  { label: "TVL 90d change", value: "tvl_90d_change" },
  { label: "TVL 180d change", value: "tvl_180d_change" },
]

export const volumeOptions = [
  { label: "Volume 24h", value: "volume_24h" },
  { label: "Volume / Mcap", value: "volmc_ratio" },
]

export const otherOptions = [
  { label: "GMV", value: "gmv_annualized" },
  { label: "Twitter followers", value: "twitter_followers" },
]

export const createCustomTableRows = (
  project: ProjectType,
  customOptions: OptionType[],
  price?: number | null,
  colorStyle?: any
) => {
  const poorlyTypedProject: { [key: string]: any } = project
  return customOptions.map((option) => {
    switch (true) {
      case option.label.includes(" change"):
        if (option.label.includes("P/E") || option.label.includes("P/S")) {
          return (
            <TableRowColumn
              key={option.value}
              style={getColor(reverseNumeral(poorlyTypedProject[option.value]))}
            >
              {getLabelForPercentage(poorlyTypedProject[option.value])}
            </TableRowColumn>
          )
        }
        return (
          <TableRowColumn
            key={option.value}
            style={getColor(poorlyTypedProject[option.value])}
          >
            {getLabelForPercentage(poorlyTypedProject[option.value])}
          </TableRowColumn>
        )
      case option.label.includes("P/S"):
      case option.label.includes("P/E"):
      case option.label.includes("Mcap"):
      case option.label.includes("Price / Earnings"):
        return (
          <TableRowColumn key={option.label}>
            {getLabelForX(poorlyTypedProject[option.value])}
          </TableRowColumn>
        )

      case option.label === "Price":
        if (!!price && !!colorStyle) {
          return (
            <TableRowColumn key="price" style={colorStyle}>
              {getLabelForPrice(price)}
            </TableRowColumn>
          )
        } else {
          return (
            <TableRowColumn key={option.value}>
              {getLabelForPrice(poorlyTypedProject[option.value])}
            </TableRowColumn>
          )
        }

      case option.label.includes("TVL"):
      case option.label.includes("Volume"):
      case option.label.includes("GMV"):
      case option.label.includes("Revenue"):
      case option.label.includes("revenue"):
      case option.label.includes("Price A"):
      case option.label.includes("Market cap"):
        return (
          <TableRowColumn key={option.value}>
            {getLabelForPrice(poorlyTypedProject[option.value])}
          </TableRowColumn>
        )
      case option.label.includes("Twitter followers"):
        return (
          <TableRowColumn key={option.value}>
            {getLabelForNumber(poorlyTypedProject[option.value])}
          </TableRowColumn>
        )
      default:
        return (
          <TableRowColumn key={option.value}>
            {poorlyTypedProject[option.value]}
          </TableRowColumn>
        )
    }
  })
}

export const getCustomizedHeaders = (customTableColumns: OptionType[]) =>
  [
    {
      label: "Project",
      flex: "1.5",
      sortKey: "name",
      tooltipId: "table-project",
    },
  ].concat(
    customTableColumns.map((option) => ({
      label: option.label,
      flex: "1",
      sortKey: option.value,
      tooltipId: `table-${option.value}`,
    }))
  )

export const CustomizeTableButton = ({ onClick }: { onClick: () => void }) => (
  <CustomizeButton onClick={onClick}>
    <Customize />
    <div style={{ marginLeft: "5px" }}>{"Customize table"}</div>
  </CustomizeButton>
)

const CustomizeButton = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #00cf9d;
  color: #fff;

  margin-left: 8px;
  cursor: pointer;
  padding: 4px 8px;
  background: #00cf9d;

  font-family: FKGrotesk-SemiMono;
  font-size: 11px;

  @media (max-width: 720px) {
    margin: 8px 8px 0px 0px;
  }

  &:hover {
    opacity: 0.8;
  }
`

export const getSortArrow = (
  item: string,
  sortByKey: { key: string; asc: boolean }
) => {
  if (item !== sortByKey.key) return
  return sortByKey.asc ? <ArrowUp /> : <ArrowDown />
}
