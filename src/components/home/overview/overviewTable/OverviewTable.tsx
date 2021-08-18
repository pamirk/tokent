import React, { useEffect, useState } from "react"

import {
  Download,
  DownloadButton,
  findItemsWithMatchingCategory,
  HeaderColumnType,
  SortByKeyType,
  TableButton,
  TableButtonContainer,
  TableContainer,
  TableContents,
  TableHeader,
  tableSorter,
} from "components/generic/table/Table"
import {
  Title,
  TitleWrapper,
  UpgradeModal,
} from "components/generic/charts/ChartComponents"
import OverviewTableRow from "./OverviewTableRow"
import { Link } from "react-router-dom"
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
import { ProjectsType } from "types/ApiTypes"

const headerColumns: HeaderColumnType[] = [
  {
    label: "Project",
    flex: "1.5",
    sortKey: "name",
    tooltipId: "table-project",
  },
  { label: "Price", flex: "1", sortKey: "price", tooltipId: "table-price" },
  {
    label: "24h",
    flex: "1",
    sortKey: "price_24h_change",
    tooltipId: "table-price_24h",
  },
  {
    label: "7d",
    flex: "1",
    sortKey: "price_7d_change",
    tooltipId: "table-price_7d",
  },
  {
    label: "Market cap",
    flex: "1",
    sortKey: "market_cap",
    tooltipId: "table-market_cap",
  },
  {
    label: "Fully-diluted",
    flex: "1",
    sortKey: "market_cap_fully_diluted",
    tooltipId: "table-market_cap_fully_diluted",
  },
  {
    label: "Vol. 24h",
    flex: "1",
    sortKey: "volume_24h",
    tooltipId: "table-volume_24h",
  },
  { label: "TVL", flex: "1", sortKey: "tvl", tooltipId: "table-tvl" },
  {
    label: "7d",
    flex: "1",
    sortKey: "tvl_7d_change",
    tooltipId: "table-tvl_7d",
  },
  {
    label: "Revenue",
    flex: "1",
    sortKey: "revenue_30d",
    tooltipId: "table-revenue_30d",
  },
  {
    label: "7d",
    flex: "1",
    sortKey: "revenue_7d_change",
    tooltipId: "table-revenue_7d_change",
  },
  { label: "P/S ratio", flex: "1", sortKey: "ps", tooltipId: "table-ps" },
  { label: "P/E ratio", flex: "1", sortKey: "pe", tooltipId: "table-pe" },
]

type TableButtonType = { key: string; label: string }

const tableButtons: TableButtonType[] = [
  { key: "DeFi", label: "Dapps (L2)" },
  { key: "Blockchain", label: "Blockchains (L1)" },
]

type Props = { customProjects?: ProjectsType; showButtons?: boolean }

const OverviewTable = (props: Props) => {
  const { projects, isMobile } = useData()

  const { customProjects, showButtons } = props

  const { user } = useAuth()
  const [selectedButtons, setSelectedButtons] = useState<string[]>([
    "DeFi",
    "Blockchain",
  ])
  const [sortByKey, setSortByKey] = useState<SortByKeyType>({
    key: "",
    asc: false,
  })
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false)
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const [customTableColumns, setCustomTableColumns] = useState<OptionType[]>([])
  useEffect(() => {
    setSortByKey({ key: "revenue_30d", asc: false })
  }, [])

  const handleSortClick = (key: string) => {
    if (sortByKey.key === key) {
      setSortByKey({ key, asc: !sortByKey.asc })
    } else {
      setSortByKey({ key, asc: true })
    }
  }

  const items = findItemsWithMatchingCategory(
    customProjects || projects,
    selectedButtons
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

    downloadCSVFromJson("Token Terminal Projects Data Table", tableData)
  }

  const renderTableRows = () => {
    if (document.body.clientWidth <= 720) {
      return results.map((item) => (
        <Link
          key={item.name}
          style={{ color: "inherit" }}
          to={"/terminal/projects/" + item.project_id}
        >
          <OverviewTableRow
            key={item.name}
            project={item}
            customOptions={customTableColumns}
          />
        </Link>
      ))
    }
    return results.map((item) => (
      <OverviewTableRow
        key={item.name}
        project={item}
        customOptions={customTableColumns}
      />
    ))
  }

  const handleTableButtonClick = (value: string) => {
    if (selectedButtons.includes(value)) {
      return setSelectedButtons(selectedButtons.filter((key) => key !== value))
    }
    setSelectedButtons(selectedButtons.concat(value))
  }

  return (
    <TableContainer>
      <TitleWrapper>
        <Tooltip id="projects-table-title">
          <Title>{"Projects"}</Title>
        </Tooltip>
        <CustomizeTableButton onClick={() => setIsCustomizeOpen(true)} />
        {showButtons && (
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
        )}
      </TitleWrapper>
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
      </Download>
    </TableContainer>
  )
}

OverviewTable.defaultProps = { showButtons: true }

export default OverviewTable
