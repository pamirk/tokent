import React, { useEffect, useMemo, useState } from "react"

import { RevenueMetricsState, RevenueMetricsType } from "types/ApiTypes"
import ChartContainer, {
  ButtonType,
} from "components/generic/charts/ChartContainer"
import { labelRevenueMetrics } from "helpers/chartHelpers"
import { fetchProtocolRevenueMetrics } from "api/ApiCalls"
import StackedBarChart from "components/generic/charts/StackedBarChart"
import { getChartKeys, getTopXKeys } from "components/generic/charts/ChartUtils"

type Props = {
  data: RevenueMetricsState
  updateMetrics: (interval: string, data: RevenueMetricsType) => void
}

const HistoricalProtocolRevenue = (props: Props) => {
  const { data, updateMetrics } = props
  const [selectedLength, setSelectedLength] = useState<number>(180)
  const [category, setCategory] = useState<string[]>(["DeFi", "Blockchain"])
  const [chartType, setChartType] = useState("historical")
  const [showAsPercentage, setShowAsPercentage] = useState(false)
  const [buttons, setButtons] = useState<ButtonType[]>([
    {
      title: "Dapps",
      name: "DeFi",
      selected: true,
      tooltipId: "protocol-revenue-defi",
    },
    {
      title: "Blockchains",
      name: "Blockchain",
      selected: true,
      tooltipId: "protocol-revenue-blockchains",
    },
  ])

  const onSelectButton = (name: string) => {
    const newButtons = buttons.map((btn) => {
      if (btn.name === name) {
        return { ...btn, selected: !btn.selected }
      }
      return btn
    })

    setButtons(newButtons)
    setCategory(newButtons.filter((btn) => btn.selected).map((btn) => btn.name))
  }

  useEffect(() => {
    let isCanceled = false

    const { monthly } = data

    if (!monthly && selectedLength > 365) {
      fetchProtocolRevenueMetrics("monthly").then(
        (result) => !isCanceled && updateMetrics("monthly", result)
      )
    }

    return () => {
      isCanceled = true
    }
  }, [data, selectedLength, updateMetrics])

  const chartData = useMemo(
    () =>
      labelRevenueMetrics(
        data,
        selectedLength,
        category,
        chartType,
        "revenue_protocol"
      ),
    [data, selectedLength, category, chartType]
  )

  const top10Keys = useMemo(() => getTopXKeys(chartData, 10), [chartData])

  const buildString = () => {
    if (!category) return ""
    let str = `Top ${top10Keys.length} `

    if (category.includes("DeFi")) str += "dapps "
    if (category.length === 2) str += "and "
    if (category.includes("Blockchain")) str += "blockchains "

    str += "based on "

    if (selectedLength > 365) str += "monthly "
    if (selectedLength <= 365) str += "daily "

    str += "protocol revenue "

    if (selectedLength > 365) str += "since launch."
    if (selectedLength <= 365) str += "in the past " + selectedLength + " days."

    return str
  }

  return (
    <ChartContainer
      title="Historical protocol revenue"
      url={
        window.location.origin + "/terminal/metrics/protocol_revenue/historical"
      }
      embedUrl={
        window.location.origin +
        "/terminal/metrics/protocol_revenue/embed/historical"
      }
      name={`historical-protocol-revenue-${category}`}
      chartKeys={getChartKeys(chartData)}
      infoString={buildString()}
      chartData={chartData}
      buttons={buttons}
      selectedLength={selectedLength}
      onSelectButton={onSelectButton}
      onChartLengthChange={setSelectedLength}
      tooltipId="chart-protocol-revenue"
      onSelectChartType={setChartType}
      onSelectPercentageMode={setShowAsPercentage}
    >
      <StackedBarChart
        chartData={chartData}
        keys={top10Keys}
        label="Historical protocol revenue"
        isPercentageShareOn={showAsPercentage}
      />
    </ChartContainer>
  )
}

export default HistoricalProtocolRevenue
