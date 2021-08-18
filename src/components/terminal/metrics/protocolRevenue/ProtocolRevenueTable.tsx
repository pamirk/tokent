import React, { useState } from "react"

import ProtocolRevenueTableRow from "./ProtocolRevenueTableRow"
import {
  Download,
  DownloadButton,
  findItemsWithMatchingCategory,
  HeaderColumnType,
  SortByKeyType,
  TableButton,
  TableButtonContainer,
  TableButtonType,
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
import { useAuth } from "context/AuthContext"
import DownloadIcon from "utils/download.svg"
import { downloadCSVFromJson } from "helpers/download/download"
import Tooltip from "components/generic/tooltip/Tooltip"
import CustomizeTableModal from "components/generic/table/CustomizeModal"
import {
  CustomizeTableButton,
  getCustomizedHeaders,
  OptionType,
} from "components/generic/table/tableUtils"
import { useData } from "context/DataContext"

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
  {
    label: "24h",
    flex: "1",
    sortKey: "revenue_protocol_24h",
    tooltipId: "table-revenue_protocol_24h",
  },
  {
    label: "7d",
    flex: "1",
    sortKey: "revenue_protocol_7d",
    tooltipId: "table-revenue_protocol_7d",
  },
  {
    label: "30d",
    flex: "1",
    sortKey: "revenue_protocol_30d",
    tooltipId: "table-revenue_protocol_30d",
  },
  {
    label: "180d",
    flex: "1",
    sortKey: "revenue_protocol_180d",
    tooltipId: "table-revenue_protocol_180d",
  },
  {
    label: "24h",
    flex: "1",
    sortKey: "revenue_protocol_24h_change",
    tooltipId: "table-revenue_protocol_24h_change",
  },
  {
    label: "7d",
    flex: "1",
    sortKey: "revenue_7d_change",
    tooltipId: "table-revenue_protocol_7d_change",
  },
  {
    label: "30d",
    flex: "1",
    sortKey: "revenue_protocol_30d_change",
    tooltipId: "table-revenue_protocol-30d-change",
  },
  {
    label: "180d",
    flex: "1",
    sortKey: "revenue_protocol_180d_change",
    tooltipId: "table-revenue_protocol_180d_change",
  },
  { label: "P/S ratio", flex: "1", sortKey: "ps", tooltipId: "table-ps" },
]

const tableButtons: TableButtonType[] = [
  { key: "DeFi", label: "Dapps (L2)" },
  { key: "Blockchain", label: "Blockchains (L1)" },
]

const ProtocolRevenueTableContents = (props: {
  selectedButtons: string[]
  customTableColumns: OptionType[]
}) => {
  const { selectedButtons, customTableColumns } = props
  const { user } = useAuth()
  const { projects, isMobile } = useData()
  const [sortByKey, setSortByKey] = useState<SortByKeyType>({
    key: "revenue_protocol_30d",
    asc: false,
  })
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false)

  const handleSortClick = (key: string) => {
    if (sortByKey.key === key) {
      setSortByKey({ key, asc: !sortByKey.asc })
    } else {
      setSortByKey({ key, asc: true })
    }
  }

  const items = findItemsWithMatchingCategory(projects, selectedButtons)
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

    downloadCSVFromJson("Token Terminal Revenue Protocol Data Table", tableData)
  }

  const renderTableRows = () =>
    results.map((item) => (
      <ProtocolRevenueTableRow
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
        {isUpgradeModalVisible && (
          <UpgradeModal onClose={() => setIsUpgradeModalVisible(false)} />
        )}
      </Download>
    </TableContainer>
  )
}

const ProtocolRevenueTable = () => {
  const [selectedButtons, setSelectedButtons] = useState(["DeFi", "Blockchain"])
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const [customTableColumns, setCustomTableColumns] = useState<OptionType[]>([])

  const handleTableButtonClick = (value: string) => {
    if (selectedButtons.includes(value)) {
      return setSelectedButtons(selectedButtons.filter((key) => key !== value))
    }
    setSelectedButtons(selectedButtons.concat(value))
  }
  return (
    <>
      <TitleWrapper>
        <Tooltip id="metrics-table-title">
          <Title>{"Data table"}</Title>
        </Tooltip>
        <CustomizeTableButton onClick={() => setIsCustomizeOpen(true)} />
        <TableButtonContainer>
          {tableButtons.map((btn) => (
            <TableButton
              key={btn.key}
              isSelected={selectedButtons.includes(btn.key)}
              onClick={() => handleTableButtonClick(btn.key)}
            >
              {btn.label}
            </TableButton>
          ))}
        </TableButtonContainer>
      </TitleWrapper>
      <ProtocolRevenueTableContents
        selectedButtons={selectedButtons}
        customTableColumns={customTableColumns}
      />
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
    </>
  )
}

export default ProtocolRevenueTable
