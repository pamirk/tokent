import React, { useEffect, useState } from "react"
import { ProjectMetricsType, ProjectType } from "types/ApiTypes"
import { labelCustomChartData } from "helpers/chartHelpers"
import {
  fetchDailyProjectMetrics,
  fetchMonthlyProjectMetrics,
} from "api/ApiCalls"
import {
  ChartLengthSection,
  ExpandChartModal,
  Img,
  InfoString,
  NoDataDiv,
  RightAlignedButtons,
  Title,
  TitleWrapper,
  WhiteButton,
} from "components/generic/charts/ChartComponents"
import styled from "styled-components"
import ButtonDropdown from "components/generic/button/ButtonDropdown"
import { OptionType } from "types/Types"
import { useData } from "context/DataContext"
import CustomChart from "components/generic/charts/CustomChart"
import Tooltip from "components/generic/tooltip/Tooltip"
import DownloadIcon from "utils/download.svg"
import ExpandIcon from "utils/expand.svg"
import { capitalize, downloadCSVFromJson } from "helpers/download/download"
import { useAuth } from "context/AuthContext"
import { Link } from "react-router-dom"
import { flatten } from "lodash"
import X from "utils/x.svg"
import { projectKeysMap } from "helpers/download/utils"
import { borderColor } from "context/theme"

type MetricsType = { daily: ProjectMetricsType; monthly: ProjectMetricsType }

const TypeOptions = [
  { name: "line", label: "Line" },
  { name: "bar", label: "Bar" },
  { name: "area", label: "Area" },
]
const StackOptions = [
  { name: "stacked", label: "Stacked" },
  { name: "unstacked", label: "Unstacked" },
]
const MetricOptions = [
  {
    label: "Fully-diluted mc.",
    name: "market_cap_fully_diluted",
  },
  {
    label: "Circulating mc.",
    name: "market_cap_circulating",
  },
  { label: "Token trading vol.", name: "volume" },
  { label: "TVL", name: "tvl" },
  { label: "GMV", name: "gmv" },

  { label: "Total revenue", name: "revenue" },

  {
    label: "Supply-side revenue",
    name: "revenue_supply_side",
  },
  {
    label: "Protocol revenue",
    name: "revenue_protocol",
  },
  { label: "P/S ratio", name: "ps" },
  { label: "P/E ratio", name: "pe" },
]

export type SettingsType = {
  metric: OptionType | undefined
  type: string
  stacked: boolean
  projects: { project: ProjectType; data?: MetricsType }[]
}
const Custom = () => {
  document.title = `Token Terminal | Custom chart`

  const { user } = useAuth()
  const { projects, isMobile } = useData()
  const [selectedLength, setSelectedLength] = useState<number>(180)

  const [settings1, setSettings1] = useState<SettingsType>({
    metric: undefined,
    type: "line",
    stacked: false,
    projects: [],
  })
  const [settings2, setSettings2] = useState<SettingsType>({
    metric: undefined,
    type: "line",
    stacked: false,
    projects: [],
  })
  const [isExpandOpen, setIsExpandOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const metric1ChartData = flatten(
    settings1.projects.map((entry) =>
      labelCustomChartData(
        selectedLength,
        selectedLength <= 365 ? entry.data?.daily : entry.data?.monthly,
        entry.project.name,
        settings1.metric?.name
      )
    )
  )

  const metric2ChartData = flatten(
    settings2.projects.map((entry) =>
      labelCustomChartData(
        selectedLength,
        selectedLength <= 365 ? entry.data?.daily : entry.data?.monthly,
        entry.project.name,
        settings2.metric?.name
      )
    )
  )

  const mergeArrays = (array: any[], key: string) => {
    const map: any = {}
    array.forEach((val) => {
      if (map[val[key]]) {
        map[val[key]] = { ...map[val[key]], ...val }
      } else {
        map[val[key]] = val
      }
    })
    return Object.keys(map).map((val) => map[val])
  }

  const chartData = mergeArrays(
    [...metric1ChartData, ...metric2ChartData],
    "datetime"
  ).sort((a, b) => {
    // sort by timestamp after merge
    const c: any = new Date(a.datetime)
    const d: any = new Date(b.datetime)
    return c - d
  })

  const getSelectedProjects = () => {
    const projects1 = settings1.projects.map((p) => p.project)
    const projects2 = settings2.projects.map((p) => p.project)

    return [...projects1, ...projects2]
  }

  const getProjectOptions = (metric?: string) =>
    projects
      ? projects
          .filter((project) =>
            !getSelectedProjects().some((e) => e.name === project.name) &&
            metric
              ? project.metric_availability[metric]
              : false
          )
          .map((project) => ({
            label: project.name,
            name: project.project_id,
          }))
      : []

  const handleProjectSelect = (selected: OptionType, index: number) => {
    const selectedProject = projects?.find((p) => p.name === selected.label)
    if (!selectedProject) return
    let results: any = {}
    fetchDailyProjectMetrics(selectedProject.project_id, 365)
      .then((data) => {
        results = { daily: data }
      })
      .then(() =>
        fetchMonthlyProjectMetrics(selectedProject.project_id).then((data) => {
          results = { ...results, monthly: data }
        })
      )
      .then(() => {
        if (index === 1) {
          const newProjects = [
            ...settings1.projects,
            { project: selectedProject, data: results },
          ]
          setSettings1({ ...settings1, projects: newProjects })
        } else {
          const newProjects = [
            ...settings2.projects,
            { project: selectedProject, data: results },
          ]
          setSettings2({ ...settings2, projects: newProjects })
        }
      })
  }

  const removeProject = (id: string) => {
    if (settings1.projects.some((entry) => entry.project.project_id === id)) {
      const newProjects = settings1.projects.filter(
        (entry) => entry.project.project_id !== id
      )
      setSettings1({ ...settings1, projects: newProjects })
    } else {
      const newProjects = settings2.projects.filter(
        (entry) => entry.project.project_id !== id
      )
      setSettings2({ ...settings2, projects: newProjects })
    }
  }

  const getKeys = () => {
    const settings1Keys = settings1.metric
      ? settings1.projects.map(
          (p) => settings1.metric?.name + "-" + p.project.name
        )
      : []
    const settings2Keys = settings2.metric
      ? settings2.projects.map(
          (p) => settings2.metric?.name + "-" + p.project.name
        )
      : []
    return [...settings1Keys, ...settings2Keys]
  }

  const buildString = () => {
    if (!settings1.metric && !settings2.metric) return ""

    const str1 =
      settings1.metric && settings1.projects.length > 0
        ? settings1.metric?.label.toLowerCase() +
          " for " +
          settings1.projects.map((p) => p.project.name).join(", ")
        : ""
    const str2 =
      settings2.metric && settings2.projects.length > 0
        ? settings2.metric?.label.toLowerCase() +
          " for " +
          settings2.projects.map((p) => p.project.name).join(", ")
        : ""

    if (str1 === "" && str2 === "") return ""

    let str = ""

    if (selectedLength > 365) str += "Monthly "
    if (selectedLength <= 365) str += "Daily "

    str += str1
    if (str1 !== "" && str2 !== "") str += " and "
    str += str2

    if (selectedLength <= 365)
      str += " in the past " + selectedLength + " days."
    if (selectedLength > 365) str += " since launch."

    return str
  }

  const handleDownload = () => {
    if (!user.paid) return
    let keys: string[] = ["datetime", ...getKeys()]
    const filteredChartData = chartData.map((entry: any) =>
      keys.reduce((obj: any, key) => {
        obj[key] = entry[key]
        return obj
      }, {})
    )

    const header = Object.keys(filteredChartData[0]).map((key) => {
      const [metric, projectName] = key.split("-")
      if (key === "datetime") return "Date"
      return projectName + " " + projectKeysMap[metric]
    })

    downloadCSVFromJson(buildString(), filteredChartData, false, header)
  }

  if (!user.paid) {
    return (
      <Container>
        <TitleWrapper>
          <Title>
            <Tooltip id={"custom-chart-title"}>{"Custom chart"}</Tooltip>
          </Title>
        </TitleWrapper>
        <Contents>
          <FreemiumContents />
        </Contents>
      </Container>
    )
  }

  return (
    <Container>
      <TitleWrapper>
        <Title>
          <Tooltip id={"custom-chart-title"}>{"Custom chart"}</Tooltip>
        </Title>
      </TitleWrapper>
      <Contents>
        {(settings1.metric || settings2.metric) && (
          <ChartLengthSection
            max={true}
            latest={false}
            selectedLength={selectedLength}
            onChartLengthChange={setSelectedLength}
          />
        )}
        <Options>
          {!isMobile && <HeaderRow />}
          <ButtonRow
            index={1}
            settings={settings1}
            setSettings={setSettings1}
            keys={getKeys()}
            handleProjectSelect={handleProjectSelect}
            projectOptions={getProjectOptions(settings1.metric?.name)}
          />
          <ButtonRow
            index={2}
            style={{ borderBottom: "unset" }}
            settings={settings2}
            setSettings={setSettings2}
            keys={getKeys()}
            handleProjectSelect={handleProjectSelect}
            projectOptions={getProjectOptions(settings2.metric?.name)}
          />
          <SelectedProjects>
            {getSelectedProjects().map((project) => (
              <Selected
                key={project.project_id}
                onClick={() => removeProject(project.project_id)}
              >
                {project.name} <Img src={X} alt={project.name} />
              </Selected>
            ))}
          </SelectedProjects>
        </Options>
        {buildString() !== "" && <InfoString>{buildString()}</InfoString>}

        {getKeys().length > 0 ? (
          <CustomChart
            data={chartData}
            keys={getKeys()}
            settings1={settings1}
            settings2={settings2}
          />
        ) : (
          <NoDataDiv>
            {"Select a project and metric to render a chart."}
          </NoDataDiv>
        )}
        {chartData.length > 0 && (
          <RightAlignedButtons>
            <WhiteButton
              name="Expand"
              icon={ExpandIcon}
              tooltipId="chart-expand"
              onClick={() => setIsExpandOpen(true)}
            />

            <WhiteButton
              name="Download"
              tooltipId={"chart-download-allowed"}
              icon={DownloadIcon}
              onClick={handleDownload}
            />
          </RightAlignedButtons>
        )}
      </Contents>
      {isExpandOpen && (
        <ExpandChartModal
          infoString={buildString()}
          closeModal={() => setIsExpandOpen(false)}
        >
          <CustomChart
            data={chartData}
            keys={getKeys()}
            settings1={settings1}
            settings2={settings2}
          />
        </ExpandChartModal>
      )}
    </Container>
  )
}

export default Custom

const HeaderRow = () => {
  const headerKeys = [
    "Select metric",
    "Select project(s)",
    "Chart type",
    "Stack / unstack data",
  ]
  return (
    <HeaderContainer>
      {headerKeys.map((key) => (
        <HeaderItem key={key}>{key}</HeaderItem>
      ))}
    </HeaderContainer>
  )
}

const Options = styled.div`
  @media (max-width: 720px) {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`

const HeaderContainer = styled.div`
  display: inline-flex;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;

  border-bottom: 1px solid ${borderColor};
`

const HeaderItem = styled.div`
  width: 150px;
  text-align: center;
  padding: 0px 10px 5px 10px;
  border-left: 1px solid ${borderColor};

  &:first-of-type {
    border-left: unset;
  }

  @media (max-width: 720px) {
    width: 120px;
  }
`

type ButtonRowProps = {
  settings: SettingsType
  index: number
  setSettings: any
  keys: string[]
  style?: any
  handleProjectSelect: (val: any, index: number) => void
  projectOptions: OptionType[]
}
const ButtonRow = (props: ButtonRowProps) => {
  const {
    index,
    settings,
    style,
    setSettings,
    keys,
    handleProjectSelect,
    projectOptions,
  } = props

  const { isMobile } = useData()
  return (
    <MetricRow style={style}>
      <ButtonWrapper>
        <ButtonDropdown
          style={{ width: isMobile ? "120px" : "150px", margin: "unset" }}
          selected={settings.metric?.label}
          onOptionSelect={(value) =>
            setSettings({ ...settings, metric: value })
          }
          options={MetricOptions}
          tooltipId="competitive-metric"
          placeholder="Select metric"
        />
      </ButtonWrapper>
      <ButtonWrapper>
        <ButtonDropdown
          style={{ width: isMobile ? "120px" : "150px", margin: "unset" }}
          onOptionSelect={(val) => handleProjectSelect(val, index)}
          options={projectOptions}
          placeholder="Add project"
          disabled={keys.length === 14}
          tooltipId="competitive-add-project"
        />
      </ButtonWrapper>
      <ButtonWrapper>
        <ButtonDropdown
          style={{ width: isMobile ? "120px" : "150px", margin: "unset" }}
          selected={capitalize(settings.type)}
          onOptionSelect={(value) =>
            setSettings({ ...settings, type: value.name })
          }
          options={TypeOptions}
          tooltipId="custom-chart-type"
          placeholder="Line"
        />
      </ButtonWrapper>

      <ButtonWrapper>
        <ButtonDropdown
          style={{ width: isMobile ? "120px" : "150px", margin: "unset" }}
          selected={settings.stacked ? "Stacked" : "Unstacked"}
          onOptionSelect={(value) =>
            setSettings({
              ...settings,
              stacked: value.name === "stacked",
            })
          }
          options={StackOptions}
          tooltipId="custom-chart-stacked"
          disabled={settings.type === "line"}
          placeholder="Unstacked"
        />
      </ButtonWrapper>
    </MetricRow>
  )
}

const Container = styled.div``

const ButtonWrapper = styled.div`
  padding: 5px 10px;
  border-left: 1px solid ${borderColor};

  &:first-of-type {
    border-left: unset;
  }

  @media (max-width: 720px) {
    border-left: unset;
    padding: 5px;
  }
`

const Contents = styled.div`
  padding: 16px 32px;

  @media (max-width: 720px) {
    padding: 16px;
  }
`

const MetricRow = styled.div`
  display: flex;
  width: fit-content;

  border-bottom: 1px solid ${borderColor};

  @media (max-width: 720px) {
    flex-direction: column;
    border-bottom: unset;
  }
`

const FreemiumContents = () => {
  const { isLoggedIn } = useAuth()
  return (
    <>
      <Text>
        {"This feature is only available for Token Terminal Pro users."}
      </Text>
      <Text style={{ margin: "20px 0px" }}>
        {
          "Want this feature? After creating your account you can choose to upgrade to the Pro version of Token Terminal."
        }
      </Text>
      <BottomButtons>
        <ContactButton href="mailto:aleksis@tokenterminal.xyz">
          {"Contact sales"}
        </ContactButton>
        <CreateAccountButton to={isLoggedIn ? "/account" : "/login"}>
          {isLoggedIn ? "Ssubscribe" : "Create account"}
        </CreateAccountButton>
      </BottomButtons>
    </>
  )
}

const Text = styled.div`
  font-family: FKGrotesk-SemiMono;
`

const BottomButtons = styled.div`
  display: flex;

  @media (max-width: 720px) {
    justify-content: flex-start;
  }
`

const CreateAccountButton = styled(Link)`
  border: 1px solid #858585;
  width: max-content;
  height: 21px;
  font-size: 11px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #858585;
  margin-left: 16px;

  padding: 0px 10px;

  &:hover {
    border-color: #00cf9d;
    color: #00cf9d;
  }
`

const ContactButton = styled.a`
  border: 1px solid #858585;
  width: max-content;
  height: 21px;
  font-size: 11px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #858585;

  padding: 0px 10px;

  &:hover {
    border-color: #00cf9d;
    color: #00cf9d;
  }
`

export const SelectedProjects = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 5px 0px 0px 10px;
`

export const Selected = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 10px;
  color: #00cf9d;
  margin-right: 8px;
  margin-bottom: 8px;
  min-width: 48px;
  padding: 0px 7px;
  text-align: center;
  cursor: pointer;
  line-height: 24px;
  background-color: transparent;
  border: 1px solid #00cf9d;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`
