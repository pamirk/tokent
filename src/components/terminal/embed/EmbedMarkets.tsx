import React, { useEffect, useState } from "react"

import { MarketMetricsType, MarketMetricsState } from "types/ApiTypes"
import { fetchMarketMetrics } from "api/ApiCalls"
import { useParams } from "react-router-dom"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import { useData } from "context/DataContext"
import MarketMetrics from "../markets/MarketMetrics"
import MarketsCompetitive from "../markets/MarketsCompetitive"

interface RouteParams {
  marketId: string
  chartId: string
}

const EmbedMarkets = () => {
  const { markets } = useData()
  const { marketId, chartId } = useParams<RouteParams>()

  const [marketMetrics, setMarketMetrics] = useState<MarketMetricsState>({
    daily: undefined,
    monthly: undefined,
  })

  const updateMarketMetrics = (interval: string, data?: MarketMetricsType) => {
    setMarketMetrics({ ...marketMetrics, [interval]: data })
  }

  useEffect(() => {
    if (!markets) return

    let isCanceled = false
    window.scrollTo(0, 0)
    if (!isCanceled) {
      updateMarketMetrics("daily", undefined)
    }
    fetchMarketMetrics(marketId, "daily").then(
      (data) => !isCanceled && updateMarketMetrics("daily", data)
    )

    return () => {
      isCanceled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketId])

  const currentMarket = markets?.find((market) => market.market_id === marketId)

  const renderChart = () => {
    if (!currentMarket) return
    switch (chartId) {
      case "metrics":
        return (
          <MarketMetrics
            data={marketMetrics}
            market={currentMarket}
            updateMarketMetrics={updateMarketMetrics}
            marketId={marketId}
          />
        )

      case "competitive":
        return (
          <MarketsCompetitive
            data={marketMetrics}
            marketId={marketId}
            updateMarketMetrics={updateMarketMetrics}
          />
        )

      default:
        return <span>{"Invalid chart id"}</span>
    }
  }
  return (
    <Container>
      {marketMetrics["daily"] ? renderChart() : <ChartLoadingAnimation />}
    </Container>
  )
}

export default EmbedMarkets
