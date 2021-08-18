import React, { useEffect, useState } from "react"

import { TVLMetricsState, TVLMetricsType } from "types/ApiTypes"
import ChartContainer, {
  ButtonType,
} from "components/generic/charts/ChartContainer"
import { fetchTVLMetrics } from "api/ApiCalls"
import BarChartGraph from "components/generic/charts/BarChart"
import { labelTotalTVLData } from "helpers/chartHelpers"

type Props = {
  data: TVLMetricsState
  updateMetrics: (interval: string, data: TVLMetricsType) => void
}

const AvgTVL = (props: Props) => {
  const { data, updateMetrics } = props
  const [selectedLength, setSelectedLength] = useState<number>(1)
  const [category, setCategory] = useState<string>("DeFi")
  const [buttons, setButtons] = useState<ButtonType[]>([
    { title: "Dapps", name: "DeFi", selected: true, tooltipId: "tvl-dapps" },
  ])

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
    setCategory(name)
  }

  useEffect(() => {
    let isCanceled = false

    const { monthly } = data

    if (!monthly && selectedLength > 365) {
      fetchTVLMetrics("monthly").then(
        (result) => !isCanceled && updateMetrics("monthly", result)
      )
    }

    return () => {
      isCanceled = true
    }
  }, [data, selectedLength, updateMetrics])

  const buildString = () => {
    if (!category) return ""
    let str = "Top "

    if (category === "DeFi") str += "dapps "
    if (category === "Blockchains") str += "blockchains "

    str += " based on total value locked."

    return str
  }

  const chartData = labelTotalTVLData(data, selectedLength, category)

  return (
    <ChartContainer
      title="Total value locked (TVL)"
      chartData={chartData}
      url={window.location.origin + "/terminal/metrics/tvl/total"}
      embedUrl={window.location.origin + "/terminal/metrics/tvl/embed/total"}
      name={`tvl-${selectedLength}`}
      chartKeys={["project", "tvl"]}
      tooltipId="chart-tvl"
      infoString={buildString()}
      buttons={buttons}
      selectedLength={selectedLength}
      onSelectButton={onSelectButton}
      onChartLengthChange={setSelectedLength}
      latest={true}
      max={false}
    >
      <BarChartGraph
        chartData={chartData}
        label="Total value locked"
        xAxisDataKey="project"
        barDataKey="tvl"
      />
    </ChartContainer>
  )
}

export default AvgTVL
