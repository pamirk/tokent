import React, { useEffect, useMemo, useState } from "react"

import { TVLMetricsState, TVLMetricsType } from "types/ApiTypes"
import ChartContainer, {
  ButtonType,
} from "components/generic/charts/ChartContainer"
import { labelTVLMetrics } from "helpers/chartHelpers"
import { fetchTVLMetrics } from "api/ApiCalls"
import StackedBarChart from "components/generic/charts/StackedBarChart"
import { getChartKeys, getTopXKeys } from "components/generic/charts/ChartUtils"

type Props = {
  data: TVLMetricsState
  updateMetrics: (interval: string, data: TVLMetricsType) => void
}

const TotalTVL = (props: Props) => {
  const { data, updateMetrics } = props
  const [selectedLength, setSelectedLength] = useState<number>(180)
  const [category, setCategory] = useState<string>("DeFi")
  const [showAsPercentage, setShowAsPercentage] = useState(false)

  const [buttons, setButtons] = useState<ButtonType[]>([
    {
      title: "Dapps",
      name: "DeFi",
      selected: true,
      tooltipId: "tvl-dapps",
    },
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

  const chartData = useMemo(
    () => labelTVLMetrics(data, selectedLength, [category]),
    [data, selectedLength, category]
  )

  const top10Keys = useMemo(() => getTopXKeys(chartData, 10), [chartData])

  const buildString = () => {
    if (!category) return ""
    let str = `Top ${top10Keys.length} `

    if (category === "DeFi") str += "dapps "

    str += "based on "

    if (selectedLength > 365) str += "monthly "
    if (selectedLength <= 365) str += "daily "

    str += "total value locked "

    if (selectedLength > 365) str += "since launch."
    if (selectedLength <= 365) str += "in the past " + selectedLength + " days."

    return str
  }

  return (
    <ChartContainer
      title="Historical total value locked (TVL)"
      tooltipId="chart-tvl"
      name={`historical-tvl-${category}`}
      url={window.location.origin + "/terminal/metrics/tvl/historical"}
      embedUrl={
        window.location.origin + "/terminal/metrics/tvl/embed/historical"
      }
      chartKeys={getChartKeys(chartData)}
      infoString={buildString()}
      chartData={chartData}
      buttons={buttons}
      selectedLength={selectedLength}
      onSelectButton={onSelectButton}
      onChartLengthChange={setSelectedLength}
      onSelectPercentageMode={setShowAsPercentage}
    >
      <StackedBarChart
        chartData={chartData}
        keys={top10Keys}
        isPercentageShareOn={showAsPercentage}
      />
    </ChartContainer>
  )
}

export default TotalTVL
