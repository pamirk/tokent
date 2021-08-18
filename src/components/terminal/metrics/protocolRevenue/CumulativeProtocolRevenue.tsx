import React, { useEffect, useMemo, useState } from "react"

import { RevenueMetricsState, RevenueMetricsType } from "types/ApiTypes"
import ChartContainer, {
  ButtonType,
} from "components/generic/charts/ChartContainer"
import { labelCumulativeRevenueMetrics } from "helpers/chartHelpers"
import { fetchProtocolRevenueMetrics } from "api/ApiCalls"
import { getTopXKeys } from "components/generic/charts/ChartUtils"
import BarChartGraph from "components/generic/charts/BarChart"

type Props = {
  data: RevenueMetricsState
  updateMetrics: (interval: string, data: RevenueMetricsType) => void
}

const CumulativeProtocolRevenue = (props: Props) => {
  const { data, updateMetrics } = props
  const [selectedLength, setSelectedLength] = useState<number>(30)
  const [category, setCategory] = useState<string[]>(["DeFi", "Blockchain"])
  const [buttons, setButtons] = useState<ButtonType[]>([
    {
      title: "Dapps",
      name: "DeFi",
      selected: true,
      tooltipId: "protocol-revenue-dapps",
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
      labelCumulativeRevenueMetrics(
        data,
        selectedLength,
        category,
        "revenue_protocol"
      ),
    [data, selectedLength, category]
  )

  const keys = getTopXKeys(chartData, 30)

  const buildString = () => {
    if (!category) return ""
    let str = "Top "

    if (category.includes("DeFi")) str += "dapps "
    if (category.length === 2) str += "and "
    if (category.includes("Blockchain")) str += "blockchains "

    str += "based on cumulative protocol revenue "

    if (selectedLength > 365) str += "since launch."
    if (selectedLength <= 365) str += "in the past " + selectedLength + " days."

    return str
  }

  return (
    <ChartContainer
      title="Protocol revenue"
      name={`cumulative-protocol-revenue-${category}`}
      tooltipId="chart-protocol-revenue"
      url={
        window.location.origin + "/terminal/metrics/protocol_revenue/cumulative"
      }
      embedUrl={
        window.location.origin +
        "/terminal/metrics/protocol_revenue/embed/cumulative"
      }
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
        label="Protocol revenue"
        xAxisDataKey="project"
        barDataKey="revenue_protocol"
      />
    </ChartContainer>
  )
}

export default CumulativeProtocolRevenue
