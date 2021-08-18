import React, { useEffect, useMemo, useState } from "react"

import {
  MarketMetricsState,
  MarketMetricsType,
  MarketType,
} from "types/ApiTypes"
import ChartContainer, {
  ButtonType,
} from "components/generic/charts/ChartContainer"
import {
  allowedCumulativeMetrics,
  labelMarketMetrics,
} from "helpers/chartHelpers"
import { fetchMarketMetrics } from "api/ApiCalls"
import StackedBarChart from "components/generic/charts/StackedBarChart"
import LineChart from "components/generic/charts/LineChart"
import { getTopXKeys } from "components/generic/charts/ChartUtils"
import { getGMVText } from "components/generic/charts/ChartComponents"

type Props = {
  data: MarketMetricsState
  marketId: string
  market: MarketType
  updateMarketMetrics: (interval: string, data: MarketMetricsType) => void
}

const MarketMetrics = (props: Props) => {
  const { data, marketId, market, updateMarketMetrics } = props
  const [selectedLength, setSelectedLength] = useState<number>(180)
  const [metric, setMetric] = useState<string>("market_cap")
  const [chartType, setChartType] = useState<string>("historical")
  const [showAsPercentage, setShowAsPercentage] = useState(false)
  const allowGMV =
    metric === "gmv" &&
    (marketId.toLowerCase() === "exchange" ||
      marketId.toLowerCase() === "blockchain")

  const [buttons, setButtons] = useState<ButtonType[]>([
    {
      title: "Market cap",
      name: "market_cap",
      selected: true,
      tooltipId: "markets-market-cap",
    },
    { title: "TVL", name: "tvl", selected: false, tooltipId: "markets-tvl" },
    {
      title: getGMVText(market.market),
      name: "gmv",
      selected: false,
      tooltipId: "markets-gmv",
      projectId: marketId,
    },
    {
      title: "Revenue",
      name: "revenue",
      selected: false,
      tooltipId: "markets-revenue",
    },
    {
      title: "P/S ratio",
      name: "ps",
      selected: false,
      tooltipId: "markets-ps",
    },
    {
      title: "P/E ratio",
      name: "pe",
      selected: false,
      tooltipId: "markets-pe",
    },
  ])

  const showCumulativeOption = metric === "revenue" || allowGMV

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

    if (!showCumulativeOption) {
      setChartType("historical")
    }
  }

  useEffect(() => {
    if (!showCumulativeOption) {
      setChartType("historical")
    }
  }, [chartType, showCumulativeOption])

  useEffect(() => {
    let isCanceled = false

    const { monthly } = data

    if (!monthly && selectedLength > 365) {
      fetchMarketMetrics(marketId, "monthly").then(
        (result) => !isCanceled && updateMarketMetrics("monthly", result)
      )
    }

    return () => {
      isCanceled = true
    }
  }, [data, marketId, selectedLength, updateMarketMetrics])

  const chartData = useMemo(
    () => labelMarketMetrics(data, selectedLength, metric, chartType, allowGMV),
    [data, selectedLength, metric, chartType, allowGMV]
  )

  const keys = getTopXKeys(chartData, 10, metric === "ps" || metric === "pe")

  const buildString = () => {
    if (!metric) return ""

    const isCumulative = chartType === "cumulative"

    let str = ""
    if (marketId === "lending") str += "Top lending protocols based on "
    if (marketId === "exchange") str += "Top exchanges based on "
    if (marketId === "defi") str += "Top dapps based on "
    if (marketId === "blockchain") str += "Top blockchains based on "

    if (selectedLength > 365) str += "monthly "
    if (selectedLength <= 365) str += "daily "

    if (isCumulative && allowedCumulativeMetrics.includes(metric)) {
      if (!(metric === "gmv" && !allowGMV)) {
        str += "cumulative "
      }
    }

    if (metric === "tvl") str += "total value locked"
    if (metric === "gmv") str += "GMV"
    if (metric === "market_cap") str += "market cap"
    if (metric === "revenue") str += "total revenue"
    if (metric === "ps") str += "P/S ratio"
    if (metric === "pe") str += "P/E ratio"

    if (selectedLength <= 365)
      str += " in the past " + selectedLength + " days."
    if (selectedLength > 365) str += " since launch."

    return str
  }

  const pathname = window.location.pathname
  const chartTitle = pathname.includes("/embed/")
    ? `${market.market} key metrics`
    : "Market metrics"

  return (
    <ChartContainer
      title={chartTitle}
      chartKeys={keys}
      tooltipId="chart-market-metrics"
      url={
        window.location.origin + "/terminal/markets/" + marketId + "/metrics"
      }
      embedUrl={
        window.location.origin +
        "/terminal/markets/" +
        marketId +
        "/embed/metrics"
      }
      name={`${marketId}-metrics-${metric}`}
      infoString={buildString()}
      chartData={chartData}
      buttons={buttons}
      selectedLength={selectedLength}
      onSelectButton={onSelectButton}
      onChartLengthChange={setSelectedLength}
      onSelectChartType={showCumulativeOption ? setChartType : undefined}
      onSelectPercentageMode={
        metric === "pe" || metric === "ps" ? undefined : setShowAsPercentage
      }
    >
      {metric !== "ps" && metric !== "pe" && (
        <StackedBarChart
          chartData={chartData}
          keys={keys}
          label={metric}
          isPercentageShareOn={showAsPercentage}
        />
      )}
      {(metric === "ps" || metric === "pe") && (
        <LineChart chartData={chartData} keys={keys} metric={metric} />
      )}
    </ChartContainer>
  )
}

export default MarketMetrics
