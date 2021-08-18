import React, { useEffect, useState } from "react"

import {
  MarketMetricsType,
  MarketMetricsState,
  MarketType,
} from "types/ApiTypes"
import { fetchMarketMetrics } from "api/ApiCalls"
import { useParams } from "react-router-dom"
import MarketInfo from "./MarketInfo"
import MarketMetrics from "./MarketMetrics"
import MarketsCompetitive from "./MarketsCompetitive"
import MarketsTable from "./MarketsTable"
import {
  ChartLoadingAnimation,
  Container,
} from "components/generic/charts/ChartComponents"
import { useData } from "context/DataContext"

interface RouteParams {
  marketId: string
}

const Markets = () => {
  const { markets, projects, isMobile } = useData()
  const { marketId } = useParams<RouteParams>()

  const currentMarket = markets?.find((market) => market.market_id === marketId)

  document.title = `Token Terminal | ${currentMarket?.market} metrics`

  const [marketInfo, setMarketInfo] = useState<MarketType | undefined>(
    undefined
  )
  const [marketMetrics, setMarketMetrics] = useState<MarketMetricsState>({
    daily: undefined,
    monthly: undefined,
  })

  const updateMarketMetrics = (interval: string, data?: MarketMetricsType) => {
    setMarketMetrics({ ...marketMetrics, [interval]: data })
  }

  useEffect(() => {
    let isCanceled = false
    window.scrollTo(0, 0)
    if (!isCanceled && !!markets) {
      updateMarketMetrics("daily", undefined)
      setMarketInfo(markets.find((market) => market.market_id === marketId))
    }
    fetchMarketMetrics(marketId, "daily").then(
      (data) => !isCanceled && updateMarketMetrics("daily", data)
    )

    return () => {
      isCanceled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketId])

  return (
    <Container>
      <MarketInfo
        marketId={
          currentMarket?.market_id !== "defi"
            ? currentMarket?.market_id
            : "DeFi"
        }
        data={marketInfo}
      />
      {!marketMetrics["daily"] && <ChartLoadingAnimation />}
      {marketMetrics["daily"] && currentMarket && (
        <>
          <MarketMetrics
            data={marketMetrics}
            market={currentMarket}
            updateMarketMetrics={updateMarketMetrics}
            marketId={marketId}
          />
          <MarketsCompetitive
            data={marketMetrics}
            marketId={marketId}
            updateMarketMetrics={updateMarketMetrics}
          />
        </>
      )}
      <MarketsTable
        isMobile={isMobile}
        projects={projects}
        category={currentMarket?.market}
      />
    </Container>
  )
}

export default Markets
