import React, { useEffect, useMemo, useState } from "react"

import { ProjectType, Top10ProjectMetrics } from "types/ApiTypes"
import ChartContainer, {
  ButtonType,
} from "components/generic/charts/ChartContainer"
import { cleanChartData, labelProjectTop10 } from "helpers/chartHelpers"
import { fetchDailyProjectTop10, fetchMonthlyProjectTop10 } from "api/ApiCalls"
import StackedAreaChart from "components/generic/charts/StackedAreaChart"
import { getTopXKeys } from "components/generic/charts/ChartUtils"
import { getGMVText } from "components/generic/charts/ChartComponents"

type Props = {
  defaultTop10Metrics: Top10ProjectMetrics
  dailyTop10Metrics: Top10ProjectMetrics
  monthlyTop10Metrics: Top10ProjectMetrics
  setTop10Metrics: (interval: string, metrics: Top10ProjectMetrics) => void
  project: ProjectType
}

const Composition = (props: Props) => {
  const {
    defaultTop10Metrics,
    dailyTop10Metrics,
    monthlyTop10Metrics,
    setTop10Metrics,
    project,
  } = props
  const [selectedLength, setSelectedLength] = useState<number>(180)
  const [metric, setMetric] = useState<string | undefined>(undefined)
  const [chartType, setChartType] = useState<string>("historical")
  const [showAsPercentage, setShowAsPercentage] = useState(false)

  const [buttons, setButtons] = useState<ButtonType[]>([])

  const isExchange = project.category_tags.includes("Exchange")

  const showCumulativeOption =
    (metric === "gmv" &&
      (isExchange || project.category_tags.includes("NFT"))) ||
    metric === "revenue" ||
    metric === "token_incentives"

  useEffect(() => {
    if (chartType === "cumulative" && !showCumulativeOption) {
      setChartType("historical")
    }
  }, [chartType, showCumulativeOption])

  const { project_id } = project
  const onSelectButton = (name: string) => {
    let selectedCount = 0
    const newButtons = buttons.map((btn) => {
      if (btn.name === name) {
        return { ...btn, selected: !btn.selected }
      }

      if (btn.selected) selectedCount += 1

      if (selectedCount === 1) {
        return { ...btn, selected: false }
      }
      return btn
    })

    setButtons(newButtons)
    setMetric(name)
  }

  useEffect(() => {
    if (!project) return

    const { metric_availability } = project

    const hasTVL = metric_availability.composition.tvl
    const hasRevenue = metric_availability.composition.revenue
    const hasGMV = metric_availability.composition.gmv
    const hasTokenIncentives = metric_availability.token_incentives

    const getInitialSelection = () => {
      if (hasTVL) {
        return "tvl"
      } else if (hasGMV) {
        return "gmv"
      } else if (hasRevenue) {
        return "revenue"
      } else if (hasTokenIncentives) {
        return "token_incentives"
      }
    }

    const selectedByDefault = getInitialSelection()

    const newButtons = [
      {
        title: "TVL",
        name: "tvl",
        selected: true,
        disabled: !hasTVL,
        tooltipId: "composition-tvl",
      },
      {
        title: getGMVText(project.category_tags),
        name: "gmv",
        selected: false,
        disabled: !hasGMV,
        tooltipId: "composition-gmv",
      },
      {
        title: "Revenue",
        name: "revenue",
        selected: false,
        disabled: !hasRevenue,
        tooltipId: "composition-revenue",
      },
      {
        title: "Token incentives",
        name: "token_incentives",
        selected: false,
        disabled: !hasTokenIncentives,
        tooltipId: "composition-token_incentives",
      },
    ].map((btn) => ({ ...btn, selected: btn.name === selectedByDefault }))

    setButtons(newButtons)
    setMetric(selectedByDefault)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  useEffect(() => {
    let isCanceled = false
    if (!project) return

    const hasCompositionData = Object.values(
      project.metric_availability?.composition
    ).includes(true)

    if (hasCompositionData) {
      fetchDailyProjectTop10(project.project_id, 365).then(
        (data) => !isCanceled && setTop10Metrics("daily", data)
      )

      fetchMonthlyProjectTop10(project.project_id).then(
        (data) => !isCanceled && setTop10Metrics("monthly", data)
      )
    }

    return () => {
      isCanceled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, project_id])

  const chartData = useMemo(
    () =>
      labelProjectTop10(
        defaultTop10Metrics,
        dailyTop10Metrics,
        monthlyTop10Metrics,
        selectedLength,
        chartType,
        isExchange,
        metric
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultTop10Metrics, selectedLength, metric, isExchange, chartType]
  )

  const keys = getTopXKeys(chartData, 10)

  const cleanData = cleanChartData(chartData, keys)

  const buildString = () => {
    if (!metric) return ""
    let str = ""
    const isCumulative = chartType === "cumulative"

    if (selectedLength > 365) str += "Monthly "
    if (selectedLength <= 365) str += "Daily "

    if (metric === "revenue")
      str += isCumulative ? "cumulative revenue" : "revenue"
    if (metric === "gmv")
      str += isCumulative
        ? "cumulative " + getGMVText(project.category_tags).toLowerCase()
        : getGMVText(project.category_tags).toLowerCase()
    if (metric === "tvl") str += "total value locked"
    if (metric === "token_incentives") str += "token incentives"
    str += " composition"

    if (selectedLength <= 365)
      str += " in the past " + selectedLength + " days."
    if (selectedLength > 365) str += " since launch."

    return str
  }

  if (!metric) return null

  const pathname = window.location.pathname
  const chartTitle = pathname.includes("/embed/")
    ? `${project.name} composition`
    : "Composition"

  return (
    <ChartContainer
      title={chartTitle}
      url={
        window.location.origin +
        "/terminal/projects/" +
        project_id +
        "/composition"
      }
      embedUrl={
        window.location.origin +
        "/terminal/projects/" +
        project_id +
        "/embed/composition"
      }
      name={`composition-${metric}`}
      tooltipId="chart-composition"
      infoString={buildString()}
      chartData={cleanData}
      chartKeys={keys}
      project={project}
      buttons={buttons}
      selectedLength={selectedLength}
      onSelectButton={onSelectButton}
      onChartLengthChange={setSelectedLength}
      onSelectChartType={showCumulativeOption ? setChartType : undefined}
      onSelectPercentageMode={setShowAsPercentage}
    >
      <StackedAreaChart
        data={cleanData}
        settings={keys}
        label={metric === "gmv" ? getGMVText(project.category_tags) : metric}
        isPercentageShareOn={showAsPercentage}
      />
    </ChartContainer>
  )
}

export default Composition
