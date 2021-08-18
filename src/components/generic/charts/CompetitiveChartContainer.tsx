import React, { useEffect, useState, useRef } from "react"
import ButtonDropdown from "../button/ButtonDropdown"
import X from "utils/x.svg"
import { OptionType } from "types/Types"
import {
  Container,
  Title,
  ButtonBar,
  SelectedProjects,
  Selected,
  Img,
  RightAlignedButtons,
  TitleWrapper,
  Hide,
  WhiteButton,
  InfoString,
  ChartContents,
  ExpandChartModal,
  UpgradeModal,
  ChartLengthSection,
  ChartInfo,
  CumulativeToggle,
  EmbedModal,
} from "./ChartComponents"
import ArrowUp from "utils/arrowUp.svg"
import ArrowDown from "utils/arrowDown.svg"
import { useParams } from "react-router-dom"
import { scrollToTargetAdjusted } from "helpers/scroll"
import LinkIcon from "utils/link.svg"
import DownloadIcon from "utils/download.svg"
import ExpandIcon from "utils/expand.svg"
import EmbedIcon from "utils/embed.svg"
import { copyToClipboard } from "helpers/copyToClipboard"
import { downloadCSVFromJson } from "helpers/download/download"
import { ProjectType } from "types/ApiTypes"
import Tooltip from "../tooltip/Tooltip"
import { useAuth } from "context/AuthContext"
import { getLastUpdated } from "./ChartUtils"

interface RouteParams {
  section: string
}

type Props = {
  title?: string
  chartData: any
  chartKeys: string[]
  children: React.ReactNode
  buttons: { label: string; name: string; disabled?: boolean }[]
  selectedLength: number
  selectedProjects: OptionType[]
  maxSelected: number
  projects: { name: string; label: string }[]
  selectedChartMetric?: string
  max?: boolean
  name?: string
  tooltipId?: string
  project?: ProjectType
  infoString: string
  url: string
  embedUrl: string
  onChartLengthChange: (length: number) => void
  onChangeSelectedProjects: (projects: OptionType[]) => void
  onChartMetricChange: (type: OptionType) => void
  onSelectChartType?: (value: string) => void
}
const CompetitiveChartContainer = (props: Props) => {
  const {
    buttons,
    chartData,
    children,
    maxSelected,
    name,
    tooltipId,
    projects,
    selectedLength,
    selectedProjects,
    selectedChartMetric,
    title,
    chartKeys,
    infoString,
    project,
    url,
    embedUrl,
    onChartLengthChange,
    onChangeSelectedProjects,
    onChartMetricChange,
    onSelectChartType,
  } = props

  const { section } = useParams<RouteParams>()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [copyText, setCopyText] = useState("Copy link")
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false)
  const [showEmbedModal, setShowEmbedModal] = useState<boolean>(false)
  const [chartMode, setChartMode] = useState("historical")
  const { user } = useAuth()

  useEffect(() => {
    if (!!section && name?.includes(section) && containerRef.current) {
      scrollToTargetAdjusted(containerRef.current)
    }
  }, [section, name])

  if (!!section && section !== url.split(project?.project_id + "/")[1]) {
    return null
  }
  const removeSelected = (value: OptionType) => {
    onChangeSelectedProjects(
      selectedProjects.filter((project) => project.name !== value.name)
    )
  }

  const handleProjectSelect = (value: OptionType) => {
    onChangeSelectedProjects(selectedProjects.concat([value]))
  }

  const handleCopyLink = () => {
    copyToClipboard(url)
    setCopyText("Copied")
    setTimeout(() => setCopyText("Copy link"), 3000)
  }

  const handleDownload = () => {
    if (!user.paid) return setIsUpgradeModalVisible(true)

    const selectedKeys = ["datetime", ...chartKeys]
    const filteredChartData = chartData.map((entry: any) =>
      selectedKeys.reduce((obj: any, key) => {
        obj[key] = entry[key]
        return obj
      }, {})
    )

    downloadCSVFromJson(infoString, filteredChartData)
  }

  return (
    <Container ref={containerRef}>
      <TitleWrapper>
        {title && (
          <Title>
            <Tooltip id={tooltipId || ""}>{title}</Tooltip>
          </Title>
        )}
        <Hide onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Hide chart" : "Show chart"}
          <Img src={isOpen ? ArrowUp : ArrowDown} alt="Toggle visibility" />
        </Hide>
      </TitleWrapper>
      {isOpen && (
        <ChartContents>
          <div
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              width: "100%",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <ButtonBar>
              {buttons.length > 0 && (
                <ButtonDropdown
                  selected={selectedChartMetric}
                  onOptionSelect={(value) => onChartMetricChange(value)}
                  options={buttons}
                  tooltipId="competitive-metric"
                />
              )}
              <ButtonDropdown
                onOptionSelect={handleProjectSelect}
                options={projects}
                disabled={selectedProjects.length === maxSelected}
                placeholder="Add project"
                tooltipId="competitive-add-project"
              />
            </ButtonBar>
            <ChartLengthSection
              max
              latest={false}
              selectedLength={selectedLength}
              onChartLengthChange={onChartLengthChange}
            />
          </div>
          <SelectedProjects>
            {selectedProjects.map((project) => (
              <Selected
                key={project.label}
                onClick={() => removeSelected(project)}
              >
                {project.label} <Img src={X} alt={project.label} />
              </Selected>
            ))}
          </SelectedProjects>
          <ChartInfo>
            {infoString !== "" && <InfoString>{infoString}</InfoString>}
            {/* LAST UPDATED FEATURE DISABLED FOR NOW */}
            {false && chartData.length > 0 && (
              <InfoString>{getLastUpdated(chartData)}</InfoString>
            )}
            {onSelectChartType && (
              <CumulativeToggle
                chartMode={chartMode}
                onChange={(value) => {
                  onSelectChartType(value)
                  setChartMode(value)
                }}
              />
            )}
          </ChartInfo>
          {children}
          {showModal && (
            <ExpandChartModal
              project={project}
              infoString={infoString}
              closeModal={() => setShowModal(false)}
            >
              {children}
            </ExpandChartModal>
          )}
          <RightAlignedButtons>
            <WhiteButton
              name="Embed chart"
              icon={EmbedIcon}
              tooltipId="chart-embed"
              onClick={() => setShowEmbedModal(true)}
            />
            <WhiteButton
              name="Expand"
              icon={ExpandIcon}
              tooltipId="chart-expand"
              onClick={() => setShowModal(true)}
            />
            <WhiteButton
              name={copyText}
              icon={LinkIcon}
              tooltipId="chart-copy-link"
              onClick={handleCopyLink}
            />
            {!window.location.pathname.includes("/embed/") && (
              <WhiteButton
                name="Download"
                tooltipId={"chart-download-allowed"}
                icon={DownloadIcon}
                onClick={handleDownload}
              />
            )}
          </RightAlignedButtons>
        </ChartContents>
      )}
      {isUpgradeModalVisible && (
        <UpgradeModal onClose={() => setIsUpgradeModalVisible(false)} />
      )}
      {showEmbedModal && (
        <EmbedModal url={embedUrl} onClose={() => setShowEmbedModal(false)} />
      )}
    </Container>
  )
}

export default CompetitiveChartContainer
