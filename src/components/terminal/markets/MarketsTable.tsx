import React, { useState } from "react"

import { ProjectsType } from "types/ApiTypes"
import MarketsTableRow from "./MarketsTableRow"
import {
  Download,
  DownloadButton,
  findItemsWithMatchingCategory,
  HeaderColumnType,
  SortByKeyType,
  TableContainer,
  TableContents,
  TableHeader,
  tableSorter,
} from "components/generic/table/Table"
import {
  TitleWrapper,
  Title,
  UpgradeModal,
} from "components/generic/charts/ChartComponents"
import { downloadCSVFromJson } from "helpers/download/download"
import { useAuth } from "context/AuthContext"
import DownloadIcon from "utils/download.svg"
import Tooltip from "components/generic/tooltip/Tooltip"
import {
  CustomizeTableButton,
  getCustomizedHeaders,
  OptionType,
} from "components/generic/table/tableUtils"
import CustomizeTableModal from "components/generic/table/CustomizeModal"

const headerColumns: HeaderColumnType[] = [
  {
    label: "Project",
    flex: "1.5",
    sortKey: "name",
    tooltipId: "table-project",
  },
  {
    label: "Market cap",
    flex: "1",
    sortKey: "market_cap",
    tooltipId: "table-market_cap",
  },
  { label: "Price", flex: "1", sortKey: "price", tooltipId: "table-price" },
  {
    label: "24h",
    flex: "1",
    sortKey: "price_24h",
    tooltipId: "table-price-24h",
  },
  { label: "TVL", flex: "1", sortKey: "tvl", tooltipId: "table-tvl" },
  {
    label: "GMV",
    flex: "1",
    sortKey: "gmv_annualized",
    tooltipId: "table-gmv_annualized",
  },
  {
    label: "Revenue",
    flex: "1",
    sortKey: "revenue_annualized",
    tooltipId: "table-revenue_annualized",
  },
  {
    label: "24h",
    flex: "1",
    sortKey: "revenue_24h_change",
    tooltipId: "table-revenue_24h_change",
  },
  {
    label: "7d",
    flex: "1",
    sortKey: "revenue_7d_change",
    tooltipId: "table-revenue_7d_change",
  },
  {
    label: "30d",
    flex: "1",
    sortKey: "revenue_30d_change",
    tooltipId: "table-revenue_30d_change",
  },
  {
    label: "180d",
    flex: "1",
    sortKey: "revenue_180d_change",
    tooltipId: "table-revenue_180d_change",
  },
  { label: "P/S ratio", flex: "1", sortKey: "ps", tooltipId: "table-ps" },
]

const MarketsTableContents = (props: {
  projects?: ProjectsType
  category?: string
  isMobile: boolean
  isCustomizeOpen: boolean
  setIsCustomizeOpen: (val: boolean) => void
}) => {
  const {
    projects,
    category,
    isMobile,
    isCustomizeOpen,
    setIsCustomizeOpen,
  } = props
  const { user } = useAuth()
  const [sortByKey, setSortByKey] = useState<SortByKeyType>({
    key: "",
    asc: false,
  })
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false)
  const [customTableColumns, setCustomTableColumns] = useState<OptionType[]>([])

  const handleSortClick = (key: string) => {
    if (sortByKey.key === key) {
      setSortByKey({ key, asc: !sortByKey.asc })
    } else {
      setSortByKey({ key, asc: true })
    }
  }

  const items = findItemsWithMatchingCategory(
    projects,
    category ? [category] : []
  )

  const results = tableSorter(items, sortByKey)

  const handleDownload = () => {
    if (!user.paid) return setIsUpgradeModalVisible(true)

    const headerKeys =
      customTableColumns.length > 0
        ? ["name"].concat(customTableColumns.map((k) => k.value))
        : headerColumns.map((h) => h.sortKey)
    const tableData = results.map((entry: any) =>
      headerKeys.reduce((obj: any, key) => {
        obj[key] = entry[key]
        return obj
      }, {})
    )

    downloadCSVFromJson("Token Terminal Market Data Table", tableData)
  }
  const renderTableRows = () =>
    results.map((item) => (
      <MarketsTableRow
        key={item.name}
        project={item}
        customOptions={customTableColumns}
      />
    ))

  return (
    <TableContainer>
      {!isMobile && (
        <>
          <TableHeader
            headers={
              customTableColumns.length > 0
                ? getCustomizedHeaders(customTableColumns)
                : headerColumns
            }
            handleSortClick={handleSortClick}
            projectId={category?.toLowerCase()}
            sortByKey={sortByKey}
          />
          <TableContents>{renderTableRows()}</TableContents>
        </>
      )}
      {isMobile && (
        <div style={{ overflow: "auto" }}>
          <TableHeader
            headers={
              customTableColumns.length > 0
                ? getCustomizedHeaders(customTableColumns)
                : headerColumns
            }
            handleSortClick={handleSortClick}
            sortByKey={sortByKey}
          />
          {renderTableRows()}
        </div>
      )}
      <Download>
        <DownloadButton
          name="Download"
          tooltipId="table-download-allowed"
          icon={DownloadIcon}
          onClick={handleDownload}
        />
      </Download>
      {isUpgradeModalVisible && (
        <UpgradeModal onClose={() => setIsUpgradeModalVisible(false)} />
      )}
      {isCustomizeOpen && (
        <CustomizeTableModal
          onClose={() => setIsCustomizeOpen(false)}
          onSave={(options) => {
            setCustomTableColumns(options)
            setIsCustomizeOpen(false)
          }}
          selectedOptions={customTableColumns}
        />
      )}
    </TableContainer>
  )
}

const MarketsTable = (props: {
  projects?: ProjectsType
  category?: string
  isMobile: boolean
}) => {
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)

  return (
    <>
      <TitleWrapper>
        <Tooltip id="markets-table-title">
          <Title>{"Data table"}</Title>
        </Tooltip>
        <CustomizeTableButton onClick={() => setIsCustomizeOpen(true)} />
      </TitleWrapper>
      <MarketsTableContents
        {...props}
        isCustomizeOpen={isCustomizeOpen}
        setIsCustomizeOpen={setIsCustomizeOpen}
      />
    </>
  )
}

export default MarketsTable
