import React, { useEffect, useState } from "react"

import { PSMetricsState, PSMetricsType } from "types/ApiTypes"
import ChartContainer, {
  ButtonType,
} from "components/generic/charts/ChartContainer"
import { fetchPSMetrics } from "api/ApiCalls"
import BarChartGraph from "components/generic/charts/BarChart"
import { labelPSData } from "helpers/chartHelpers"

type Props = {
  data: PSMetricsState
  updateMetrics: (interval: string, data: PSMetricsType) => void
}

const TotalPS = (props: Props) => {
  const { data, updateMetrics } = props
  const [selectedLength, setSelectedLength] = useState<number>(1)
  const [category, setCategory] = useState<string[]>(["DeFi", "Blockchain"])
  const [buttons, setButtons] = useState<ButtonType[]>([
    { title: "Dapps", name: "DeFi", selected: true, tooltipId: "ps-dapps" },
    {
      title: "Blockchains",
      name: "Blockchain",
      selected: true,
      tooltipId: "ps-blockchains",
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
      fetchPSMetrics("monthly").then(
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

    if (category.includes("DeFi")) str += "dapps "
    if (category.length === 2) str += "and "
    if (category.includes("Blockchain")) str += "blockchains "

    str += " based on lowest P/S ratio."

    return str
  }

  const chartData = labelPSData(data, selectedLength, category)

  return (
    <ChartContainer
      title="Price to sales (P/S) ratio based on total revenue"
      chartData={chartData}
      url={window.location.origin + "/terminal/metrics/ps/total"}
      embedUrl={window.location.origin + "/terminal/metrics/ps/embed/total"}
      name={`total_ps-${selectedLength}`}
      chartKeys={["project", "ps"]}
      tooltipId="chart-ps"
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
        label="P/S ratio"
        xAxisDataKey="project"
        barDataKey="ps"
      />
    </ChartContainer>
  )
}

export default TotalPS
