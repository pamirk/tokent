import React, { useEffect, useMemo, useState } from "react"
import { ProjectMetricsType, ProjectType } from "types/ApiTypes"
import ChartContainer, {
  ButtonType,
} from "components/generic/charts/ChartContainer"
import LineBarChart from "components/generic/charts/LineBarChart"
import {
  allowedCumulativeMetrics,
  cleanChartData,
  labelProjectDefaultData,
} from "helpers/chartHelpers"
import {
  fetchDailyProjectMetrics,
  fetchMonthlyProjectMetrics,
} from "api/ApiCalls"
import { getGMVText } from "components/generic/charts/ChartComponents"
import { isEqual, sortBy } from "lodash"
import LineChart from "components/generic/charts/LineChart"
import CustomBarChart from "components/generic/charts/custom/CustomBarChart"

type Props = {
  defaultProjectMetrics: ProjectMetricsType
  dailyProjectMetrics: ProjectMetricsType
  monthlyProjectMetrics: ProjectMetricsType
  setProjectMetrics: (interval: string, data: ProjectMetricsType) => void
  project: ProjectType
}

const KeyMetrics = (props: Props) => {
  const {
    defaultProjectMetrics,
    dailyProjectMetrics,
    monthlyProjectMetrics,
    setProjectMetrics,
    project,
  } = props
  const [selectedLength, setSelectedLength] = useState<number>(180)
  const [settings, setSettings] = useState<{
    lineKeys: string[]
    barKeys: string[]
  }>({ lineKeys: ["market_cap_fully_diluted"], barKeys: ["revenue"] })
  const [buttons, setButtons] = useState<ButtonType[]>([])
  const [chartType, setChartType] = useState<string>("historical")

  const { project_id } = project

  useEffect(() => {
    let isCanceled = false

    if (!!project) {
      fetchDailyProjectMetrics(project.project_id, 365).then(
        (data) => !isCanceled && setProjectMetrics("daily", data)
      )

      fetchMonthlyProjectMetrics(project.project_id).then(
        (data) => !isCanceled && setProjectMetrics("monthly", data)
      )
    }

    return () => {
      isCanceled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, project_id])

  const onSelectButton = (name: string) => {
    let selectedCount = 0
    const newButtons = buttons.map((btn) => {
      if (btn.name === name) {
        return { ...btn, selected: !btn.selected }
      }
      if (btn.selected) selectedCount += 1

      if (selectedCount === 2) {
        return { ...btn, selected: false }
      }

      return btn
    })

    setButtons(newButtons)
  }

  useEffect(() => {
    let lineKeys: string[] = []
    let barKeys: string[] = []

    const selected =
      buttons.filter((btn) => btn.selected).map((btn) => btn.name) || []

    if (selected.includes("price")) lineKeys = ["price"]

    if (selected.includes("market_cap_fully_diluted"))
      lineKeys = [...lineKeys, "market_cap_fully_diluted"]

    if (selected.includes("market_cap_circulating"))
      lineKeys = [...lineKeys, "market_cap_circulating"]

    if (selected.includes("ps")) lineKeys = [...lineKeys, "ps"]
    if (selected.includes("pe")) lineKeys = [...lineKeys, "pe"]
    if (selected.includes("revenue")) barKeys = ["revenue"]
    if (selected.includes("revenue_supply_side"))
      barKeys = [...barKeys, "revenue_supply_side"]
    if (selected.includes("revenue_protocol"))
      barKeys = [...barKeys, "revenue_protocol"]

    if (selected.includes("volume")) {
      if (barKeys.length === 0) {
        barKeys = ["volume"]
      } else {
        lineKeys = ["volume"]
      }
    }

    if (selected.includes("gmv")) {
      if (barKeys.length === 0) {
        barKeys = ["gmv"]
      } else {
        lineKeys = ["gmv"]
      }
    }

    if (selected.includes("tvl")) {
      if (barKeys.length === 0) {
        barKeys = ["tvl"]
      } else {
        lineKeys = ["tvl"]
      }
    }

    if (selected.includes("token_incentives")) {
      if (barKeys.length === 0) {
        barKeys = ["token_incentives"]
      } else {
        lineKeys = ["token_incentives"]
      }
    }

    setSettings({ lineKeys, barKeys })
  }, [buttons])

  const isNFTOrExchange =
    project.category_tags.includes("Exchange") ||
    project.category_tags.includes("NFT")
  const chartData = useMemo(
    () =>
      labelProjectDefaultData(
        defaultProjectMetrics,
        dailyProjectMetrics,
        monthlyProjectMetrics,
        selectedLength,
        chartType,
        isNFTOrExchange
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultProjectMetrics, selectedLength, chartType, isNFTOrExchange]
  )
  const cleaned = cleanChartData(chartData, [
    ...settings.barKeys,
    ...settings.lineKeys,
  ])

  useEffect(() => {
    if (!project) return

    const { metric_availability } = project

    let selectedButtons: string[] = []
    if (metric_availability.market_cap_fully_diluted) {
      selectedButtons = selectedButtons.concat("market_cap_fully_diluted")
    }

    if (metric_availability.revenue) {
      selectedButtons = selectedButtons.concat("revenue")
    }

    if (
      metric_availability.market_cap_circulating &&
      selectedButtons.length < 2
    ) {
      selectedButtons = selectedButtons.concat("market_cap_circulating")
    }

    if (metric_availability.tvl && selectedButtons.length < 2) {
      selectedButtons = selectedButtons.concat("tvl")
    }
    if (metric_availability.gmv && selectedButtons.length < 2) {
      selectedButtons = selectedButtons.concat("gmv")
    }
    if (metric_availability.ps && selectedButtons.length < 2) {
      selectedButtons = selectedButtons.concat("ps")
    }

    if (metric_availability.pe && selectedButtons.length < 2) {
      selectedButtons = selectedButtons.concat("pe")
    }

    if (metric_availability.token_incentives && selectedButtons.length < 2) {
      selectedButtons = selectedButtons.concat("token_incentives")
    }

    const initialButtons = [
      {
        title: "Price",
        name: "price",
        default: "line",
        selected: false,
        tooltipId: "keymetrics-price",
        disabled: !metric_availability.market_cap,
      },

      {
        title: "Fully-diluted market cap",
        name: "market_cap_fully_diluted",
        default: "line",
        selected: false,
        tooltipId: "keymetrics-market-cap-fully-diluted",
        disabled: !metric_availability.market_cap_fully_diluted,
      },
      {
        title: "Circulating market cap",
        name: "market_cap_circulating",
        disabled: !metric_availability.market_cap_circulating,
        default: "line",
        selected: false,
        tooltipId: "keymetrics-market-cap-circulating",
      },
      {
        title: `${project.symbol || "Token"} trading vol.`,
        name: "volume",
        default: "line",
        selected: false,
        tooltipId: "keymetrics-volume",
        disabled: !metric_availability.volume,
      },
      {
        title: "TVL",
        name: "tvl",
        default: "bar",
        selected: false,
        tooltipId: "keymetrics-tvl",
        disabled: !metric_availability.tvl,
      },
      {
        title: getGMVText(project.category_tags),
        name: "gmv",
        default: "bar",
        selected: false,
        tooltipId: "keymetrics-gmv",
        disabled: !metric_availability.gmv,
      },

      {
        title: "Total revenue",
        name: "revenue",
        disabled: !metric_availability.revenue,
        default: "bar",
        selected: false,
        tooltipId: "keymetrics-revenue",
      },

      {
        title: "Supply-side revenue",
        name: "revenue_supply_side",
        disabled: !metric_availability.revenue_supply_side,
        default: "bar",
        selected: false,
        tooltipId: "keymetrics-revenue-supply-side",
      },
      {
        title: "Protocol revenue",
        name: "revenue_protocol",
        disabled: !metric_availability.revenue_protocol,
        default: "bar",
        selected: false,
        tooltipId: "keymetrics-revenue-protocol",
      },
      {
        title: "P/S ratio",
        name: "ps",
        default: "line",
        selected: false,
        tooltipId: "keymetrics-ps",
        disabled: !metric_availability.ps,
      },
      {
        title: "P/E ratio",
        name: "pe",
        default: "line",
        selected: false,
        tooltipId: "keymetrics-pe",
        disabled: !metric_availability.pe,
      },
      {
        title: "Token incentives",
        name: "token_incentives",
        default: "line",
        selected: false,
        tooltipId: "keymetrics-token_incentives",
        disabled: !metric_availability.token_incentives,
      },
    ]

    const newButtons = initialButtons.map((btn) => {
      if (selectedButtons.includes(btn.name)) {
        return { ...btn, selected: true }
      }
      return btn
    })

    setButtons(newButtons)
  }, [project])

  const buildString = () => {
    let str = ""

    const keys = [...settings.lineKeys, ...settings.barKeys]

    if (keys.length === 0) return ""

    const isCumulative = chartType === "cumulative"

    if (selectedLength > 365) str += "Monthly "
    if (selectedLength <= 365) str += "Daily "

    sortBy(keys, (key: string) =>
      buttons.findIndex((btn) => key.includes(btn.name))
    ).forEach((key, index) => {
      if (index === 1) str += " vs. "
      if (key === "market_cap_fully_diluted") str += "fully-diluted market cap"
      if (key === "market_cap_circulating") str += "circulating market cap"

      if (key === "volume")
        str += isCumulative
          ? `cumulative ${project.symbol} trading volume`
          : `${project.symbol} trading volume`

      if (key === "tvl") str += "total value locked"
      if (key === "gmv")
        str +=
          isCumulative && isNFTOrExchange
            ? "cumulative " + getGMVText(project.category_tags).toLowerCase()
            : getGMVText(project.category_tags).toLowerCase()

      if (key === "revenue")
        str += isCumulative ? "cumulative total revenue" : "total revenue"
      if (key === "revenue_protocol")
        str += isCumulative ? "cumulative protocol revenue" : "protocol revenue"
      if (key === "revenue_supply_side")
        str += isCumulative
          ? "cumulative supply-side revenue"
          : "supply-side revenue"
      if (key === "ps") str += "P/S ratio"
      if (key === "pe") str += "P/E ratio"
      if (key === "price") str += "price"
      if (key === "token_incentives")
        str += isCumulative ? "cumulative token incentices" : "token incentives"
    })

    if (selectedLength <= 365)
      str += " in the past " + selectedLength + " days."
    if (selectedLength > 365) str += " since launch."

    return str
  }

  const showCumulativeOption = () => {
    const metrics = [...settings.lineKeys, ...settings.barKeys]

    if (isEqual(metrics, ["gmv"]) && !isNFTOrExchange) return false

    if (metrics.includes("gmv") && isNFTOrExchange) return true
    if (metrics.find((key) => allowedCumulativeMetrics.includes(key))) {
      return true
    }

    return false
  }

  const pathname = window.location.pathname
  const chartTitle = pathname.includes("/embed/")
    ? `${project.name} key metrics`
    : "Key metrics"

  const getChartType = () => {
    const linekeyStr = settings.lineKeys.toString()
    const barkeyStr = settings.barKeys.toString()
    if (
      linekeyStr === "ps,pe" ||
      linekeyStr.split("market_cap").length - 1 === 2
    ) {
      return "line"
    }

    if (barkeyStr.split("revenue").length - 1 === 2) {
      return "bar"
    }

    return "default"
  }

  return (
    <ChartContainer
      title={chartTitle}
      name="key_metrics"
      url={
        window.location.origin +
        "/terminal/projects/" +
        project_id +
        "/key_metrics"
      }
      embedUrl={
        window.location.origin +
        "/terminal/projects/" +
        project_id +
        "/embed/key_metrics"
      }
      tooltipId="chart-key-metrics"
      infoString={buildString()}
      project={project}
      chartData={cleaned}
      chartKeys={[...settings.lineKeys, ...settings.barKeys]}
      buttons={buttons}
      selectedLength={selectedLength}
      onSelectButton={onSelectButton}
      onChartLengthChange={setSelectedLength}
      onSelectChartType={showCumulativeOption() ? setChartType : undefined}
    >
      {getChartType() === "line" && (
        <LineChart
          chartData={cleaned}
          keys={settings.lineKeys}
          metric={
            settings.lineKeys.toString().split("market_cap").length - 1 === 2
              ? "market_cap"
              : "ratio"
          }
        />
      )}
      {getChartType() === "bar" && (
        <CustomBarChart
          chartData={chartData}
          keys={settings.barKeys}
          metric="revenue-multi"
        />
      )}
      {getChartType() === "default" && (
        <LineBarChart
          chartData={cleaned}
          settings={settings}
          project={project}
          buttons={buttons}
        />
      )}
    </ChartContainer>
  )
}

export default KeyMetrics
