import React, { useEffect, useState } from "react"

import { PEMetricsState, PEMetricsType } from "types/ApiTypes"
import ChartContainer, {
  ButtonType,
} from "components/generic/charts/ChartContainer"
import { fetchPEMetrics } from "api/ApiCalls"
import BarChartGraph from "components/generic/charts/BarChart"
import { labelPEData } from "helpers/chartHelpers"

type Props = {
  data: PEMetricsState
  updateMetrics: (interval: string, data: PEMetricsType) => void
}

const TotalPS = (props: Props) => {
  const { data, updateMetrics } = props
  const [selectedLength, setSelectedLength] = useState<number>(1)
  const [category, setCategory] = useState<string[]>(["DeFi", "Blockchain"])
  const [buttons, setButtons] = useState<ButtonType[]>([
    { title: "Dapps", name: "DeFi", selected: true, tooltipId: "pe-dapps" },
    {
      title: "Blockchains",
      name: "Blockchain",
      selected: true,
      tooltipId: "pe-blockchains",
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
      fetchPEMetrics("monthly").then(
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


    str += " based on lowest P/E ratio."

    return str
  }

  const chartData = labelPEData(data, selectedLength, category)

  return (
    <ChartContainer
      title="Price to earnings (P/E) ratio based on protocol revenue"
      chartData={chartData}
      url={window.location.origin + "/terminal/metrics/pe/total"}
      embedUrl={window.location.origin + "/terminal/metrics/pe/embed/total"}
      name={`total_ps-${selectedLength}`}
      chartKeys={["project", "pe"]}
      tooltipId="chart-pe"
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
        label="P/E ratio"
        xAxisDataKey="project"
        barDataKey="pe"
      />
    </ChartContainer>
  )
}

export default TotalPS
