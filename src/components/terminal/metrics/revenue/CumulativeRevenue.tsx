import React, { useEffect, useMemo, useState } from "react"

import { RevenueMetricsState, RevenueMetricsType } from "types/ApiTypes"
import ChartContainer, {
  ButtonType,
} from "components/generic/charts/ChartContainer"
import { labelCumulativeRevenueMetrics } from "helpers/chartHelpers"
import { fetchRevenueMetrics } from "api/ApiCalls"
import { keysToNotInclude } from "components/generic/charts/ChartUtils"
import BarChartGraph from "components/generic/charts/BarChart"

type Props = {
  data: RevenueMetricsState
  updateMetrics: (interval: string, data: RevenueMetricsType) => void
}

const CumulativeRevenue = (props: Props) => {
  const { data, updateMetrics } = props
  const [selectedLength, setSelectedLength] = useState<number>(30)
  const [category, setCategory] = useState<string[]>(["DeFi", "Blockchain"])
  const [buttons, setButtons] = useState<ButtonType[]>([
    {
      title: "Dapps",
      name: "DeFi",
      selected: true,
      tooltipId: "total-revenue-dapps",
    },
    {
      title: "Blockchains",
      name: "Blockchain",
      selected: true,
      tooltipId: "total-revenue-blockchains",
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
      fetchRevenueMetrics("monthly").then(
        (result) => !isCanceled && updateMetrics("monthly", result)
      )
    }

    return () => {
      isCanceled = true
    }
  }, [data, selectedLength, updateMetrics])

  const chartData = useMemo(
    () =>
      labelCumulativeRevenueMetrics(data, selectedLength, category, "revenue"),
    [data, selectedLength, category]
  )

  const keys = Array.from(
    new Set(chartData.flatMap((x) => Object.keys(x)))
  ).filter((key) => !keysToNotInclude.includes(key))

  const buildString = () => {
    if (!category) return ""
    let str = "Top "

    if (category.includes("DeFi")) str += "dapps "
    if (category.length === 2) str += "and "
    if (category.includes("Blockchain")) str += "blockchains "

    str += "based on cumulative total revenue "

    if (selectedLength > 365) str += "since launch."
    if (selectedLength <= 365) str += "in the past " + selectedLength + " days."

    return str
  }

  return (
    <ChartContainer
      title="Total revenue"
      name={`total-revenue-${category}`}
      tooltipId="chart-total-revenue"
      embedUrl={
        window.location.origin + "/terminal/metrics/revenue/embed/total"
      }
      url={window.location.origin + "/terminal/metrics/revenue/total"}
      chartKeys={keys}
      infoString={buildString()}
      chartData={chartData}
      buttons={buttons}
      selectedLength={selectedLength}
      onSelectButton={onSelectButton}
      onChartLengthChange={setSelectedLength}
    >
      <BarChartGraph
        chartData={chartData}
        label="Total revenue"
        xAxisDataKey="project"
        barDataKey="revenue"
      />
    </ChartContainer>
  )
}

export default CumulativeRevenue
