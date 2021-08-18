import {
  borderColor,
  defaultButtonColor,
  defaultButtonTextColor,
  selectedButtonColor,
  selectedButtonTextColor,
  tableRowHoverColor,
  titleWrapperColor,
} from "context/theme"
import { orderBy } from "lodash"
import React from "react"
import styled from "styled-components"
import { ProjectsType } from "types/ApiTypes"
import Button from "../button/Button"
import { TitleWrapper } from "../charts/ChartComponents"
import Tooltip from "../tooltip/Tooltip"
import { getSortArrow } from "./tableUtils"

// All commmon shared styles (styled components), functions and types used in Table around the project.

export const TableContainer = styled.div``

export const TableContents = styled.div``

export const HeaderRow = styled.div`
  position: sticky;
  top: 65px;
  background: ${titleWrapperColor};
  font-family: FKGrotesk-Medium;
  font-size: 12px;
  line-height: 17px;
  border-bottom: 1px solid ${borderColor};
  display: flex;
  align-items: center;
  display: flex;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  padding: 9px 0px 9px 32px;
  flex: 1;
  @media (max-width: 720px) {
    position: unset;
    top: 0px;
    width: fit-content;
    min-width: 100%;
    justify-content: flex-start;
    padding: 12px 12px;
  }
`

export const DownloadButton = styled(Button)<{ disabled?: boolean }>`
  border: 1px solid;
  box-sizing: border-box;
  border-radius: 2px;
  line-height: 20px;
  padding: 0px 8px;
  font-size: 11px;
  height: unset;
  margin: 0px 8px 8px 0px;
  cursor: ${(props) => (props.disabled ? "no-drop" : "pointer")};
  color: ${defaultButtonTextColor};
  background: ${defaultButtonColor};
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`

export const Download = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 16px 8px 8px 0px;
`

export const HeaderColumn = styled.div`
  @media (max-width: 720px) {
    min-width: 96px;
    max-width: 96px;
  }
  &:first-of-type {
    margin-right: 8px;

    @media (max-width: 720px) {
      min-width: 110px;
      max-width: 110px;
    }
  }
`

export const TableRowContainer = styled.div`
  font-size: 12px;
  min-height: 40px;
  margin-bottom: 1px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  box-shadow: rgb(34 34 34 / 5%) 0px 1px;
  border-radius: 1px;
  overflow: auto;
  height: 40px;
  padding-left: 32px;
  @media (max-width: 720px) {
    overflow: unset;
    width: fit-content;
    padding-left: 8px;
  }
  &:hover {
    background-color: ${tableRowHoverColor};
  }
`

export const TableRowColumn = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  overflow: auto;

  @media (max-width: 720px) {
    min-width: 96px;
    max-width: 96px;
  }

  &:first-of-type {
    justify-content: flex-start;
    flex: 1.5;
    margin-right: 8px;
    overflow: auto;

    @media (max-width: 720px) {
      min-width: 110px;
      max-width: 110px;
    }
  }

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`

export const SmallLogo = styled.img`
  width: 14px;
  height: 14px;
  margin-right: 8px;
  border-radius: 24px;
  padding: 1px;
`

export const TableButton = styled.div<{ isSelected: boolean }>`
  margin-left: 8px;
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

  &:hover {
    opacity: 0.8;
  }
`

export const TableButtonContainer = styled.div`
  display: flex;
  text-align: center;
  align-self: center;
  flex-wrap: wrap;
`

export type HeaderColumnType = {
  label: string
  flex: string
  sortKey: string
  tooltipId?: string
}

export const Title = styled.span`
  font-weight: bold;
  font-size: 20px;
  line-height: 36px;
  color: rgb(59, 60, 61);
`

export type SortByKeyType = { key: string; asc: boolean }
export type TableButtonType = { key: string; label: string }

export const tableSorter = (
  items: ProjectsType | undefined,
  sortByKey: SortByKeyType
) =>
  orderBy(
    items,
    [
      (o:any) => {
        const value =
          o[
            sortByKey.key as
              | "name"
              | "market_cap"
              | "price"
              | "price_24h_change"
              | "gmv_annualized"
              | "take_rate"
              | "revenue_annualized"
              | "revenue_24h"
              | "revenue_7d"
              | "revenue_30d"
              | "revenue_180d"
              | "revenue_24h_change"
              | "revenue_7d_change"
              | "revenue_30d_change"
              | "revenue_180d_change"
              | "ps"
              | "pe"
              | "volmc_ratio"
          ]

        if (!value && sortByKey.asc) return Infinity
        if (!value && !sortByKey.asc) return -Infinity

        return value
      },
    ],
    sortByKey.asc ? "asc" : "desc"
  )

export const findItemsWithMatchingCategory = (
  items?: ProjectsType,
  searchWords?: string[]
) =>
  items?.filter((item) =>
    Boolean(searchWords?.find((word) => item.category_tags.includes(word)))
  )

export const Table = (props: { title: string; children: React.ReactNode }) => (
  <>
    <TitleWrapper>{props.title}</TitleWrapper>
    {props.children}
  </>
)

type HeaderProps = {
  headers: HeaderColumnType[]
  projectId?: string
  handleSortClick: (i: string) => void
  sortByKey: { key: string; asc: boolean }
}

export const TableHeader = ({
  headers,
  projectId,
  handleSortClick,
  sortByKey,
}: HeaderProps) => (
  <HeaderRow>
    {headers.map((item, i) => (
      <HeaderColumn
        key={item.label + i}
        style={{ flex: item.flex }}
        onClick={() => handleSortClick(item.sortKey)}
      >
        <Tooltip id={item.tooltipId} projectId={projectId}>
          <span
            style={{
              marginRight: item.sortKey === sortByKey.key ? "5px" : "0px",
            }}
          >
            {item.label}
          </span>
        </Tooltip>
        {getSortArrow(item.sortKey, sortByKey)}
      </HeaderColumn>
    ))}
  </HeaderRow>
)

TableHeader.defaultProps = { sortByKey: { key: "", asc: false } }
