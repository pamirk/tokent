import React, { useEffect, useState } from "react"

import {
  PEMetricsState,
  PEMetricsType,
  PSMetricsState,
  PSMetricsType,
  RevenueMetricsState,
  RevenueMetricsType,
  TVLMetricsState,
  TVLMetricsType,
} from "types/ApiTypes"
import CumulativeProtocolRevenue from "components/terminal/metrics/protocolRevenue/CumulativeProtocolRevenue"
import CumulativeRevenue from "components/terminal/metrics/revenue/CumulativeRevenue"
import TotalPS from "components/terminal/metrics/ps/TotalPS"
import AvgTVL from "components/terminal/metrics/tvl/AvgTVL"
import styled from "styled-components"
import {
  fetchRevenueMetrics,
  fetchTVLMetrics,
  fetchPSMetrics,
  fetchPEMetrics,
} from "api/ApiCalls"
import { borderColor } from "context/theme"
import { useTheme } from "context/ThemeContext"
import { useData } from "context/DataContext"
import TotalPE from "components/terminal/metrics/pe/TotalPE"
import Tooltip from "components/generic/tooltip/Tooltip"
import TotalRevenue from "components/terminal/metrics/revenue/TotalRevenue"
import HistoricalProtocolRevenue from "components/terminal/metrics/protocolRevenue/HistoricalProtocolRevenue"
import TotalTVL from "components/terminal/metrics/tvl/TotalTVL"

const HomeCharts = () => {
  const { isMobile, revenueProtocol } = useData()
  const [chartIdx, setChartIdx] = useState(2)
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetricsState>({
    daily: undefined,
    monthly: undefined,
  })

  const [
    protocolRevenueMetrics,
    setProtocolRevenueMetrics,
  ] = useState<RevenueMetricsState>({
    daily: revenueProtocol,
    monthly: undefined,
  })

  const [TVLMetrics, setTVLMetrics] = useState<TVLMetricsState>({
    daily: undefined,
    monthly: undefined,
  })
  const [PSMetrics, setPSMetrics] = useState<PSMetricsState>({
    daily: undefined,
    monthly: undefined,
  })

  const [PEMetrics, setPEMetrics] = useState<PEMetricsState>({
    daily: undefined,
    monthly: undefined,
  })

  useEffect(() => {
    let isCanceled = false
    fetchRevenueMetrics("daily").then(
      (data) => !isCanceled && updateRevenueMetrics("daily", data)
    )

    fetchTVLMetrics("daily").then(
      (data) => !isCanceled && updateTVLMetrics("daily", data)
    )

    fetchPEMetrics("daily").then(
      (data) => !isCanceled && updatePEMetrics("daily", data)
    )

    fetchPSMetrics("daily").then(
      (data) => !isCanceled && updatePSMetrics("daily", data)
    )

    return () => {
      isCanceled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateRevenueMetrics = (interval: string, data: RevenueMetricsType) => {
    setRevenueMetrics({ ...revenueMetrics, [interval]: data })
  }

  const updateProtocolRevenueMetrics = (
    interval: string,
    data: RevenueMetricsType
  ) => {
    setProtocolRevenueMetrics({ ...protocolRevenueMetrics, [interval]: data })
  }

  const updatePSMetrics = (interval: string, data: PSMetricsType) => {
    setPSMetrics({ ...PSMetrics, [interval]: data })
  }

  const updatePEMetrics = (interval: string, data: PEMetricsType) => {
    setPEMetrics({ ...PEMetrics, [interval]: data })
  }

  const updateTVLMetrics = (interval: string, data: TVLMetricsType) => {
    setTVLMetrics({ ...TVLMetrics, [interval]: data })
  }

  const getNextText = () => {
    switch (chartIdx) {
      case 0:
        return "Historical total revenue"
      case 1:
        return "Protocol revenue"
      case 2:
        return "Historical protocol revenue"
      case 3:
        return "Price to sales"
      case 4:
        return "Price to earnings"
      case 5:
        return "TVL"
      case 6:
        return "Historical TVL"
      case 7:
        return "Total revenue"
    }
  }

  const getPrevText = () => {
    switch (chartIdx) {
      case 0:
        return "Historical TVL"
      case 1:
        return "Total revenue"
      case 2:
        return "Historical total revenue"
      case 3:
        return "Protocol revenue"
      case 4:
        return "Historical protocol revenue"
      case 5:
        return "Price to sales"
      case 6:
        return "Price to earnings"
      case 7:
        return "TVL"
    }
  }

  const handleNextClick = () => {
    const nextIdx = chartIdx + 1
    if (nextIdx > 7) return setChartIdx(0)
    return setChartIdx(nextIdx)
  }

  const handlePrevClick = () => {
    const nextIdx = chartIdx - 1
    if (nextIdx < 0) return setChartIdx(7)
    return setChartIdx(nextIdx)
  }

  const { mode } = useTheme()

  const renderChart = () => {
    switch (chartIdx) {
      case 0:
        return (
          <CumulativeRevenue
            data={revenueMetrics}
            updateMetrics={updateRevenueMetrics}
          />
        )
      case 1:
        return (
          <TotalRevenue
            data={revenueMetrics}
            updateMetrics={updateRevenueMetrics}
          />
        )
      case 2:
        return (
          <CumulativeProtocolRevenue
            data={protocolRevenueMetrics}
            updateMetrics={updateProtocolRevenueMetrics}
          />
        )
      case 3:
        return (
          <HistoricalProtocolRevenue
            data={protocolRevenueMetrics}
            updateMetrics={updateProtocolRevenueMetrics}
          />
        )
      case 4:
        return <TotalPS data={PSMetrics} updateMetrics={updatePSMetrics} />
      case 5:
        return <TotalPE data={PEMetrics} updateMetrics={updatePEMetrics} />
      case 6:
        return <AvgTVL data={TVLMetrics} updateMetrics={updateTVLMetrics} />
      case 7:
        return <TotalTVL data={TVLMetrics} updateMetrics={updateTVLMetrics} />
    }
  }

  return (
    <Container>
      {!isMobile && (
        <ArrowLeftCircle onClick={handlePrevClick} chartIdx={chartIdx} />
      )}
      {renderChart()}
      {!isMobile && (
        <ArrowRightCircle onClick={handleNextClick} chartIdx={chartIdx} />
      )}
      {isMobile && (
        <PrevNextButtons>
          <PrevNextButton onClick={handlePrevClick}>
            <ArrowLeft stroke={mode === "light" ? "#2A2A2A" : "#FFF"} />
            <Text>
              {"Previous chart "}
              <Text style={{ fontSize: isMobile ? "12px" : "18px" }}>
                ({getPrevText()})
              </Text>
            </Text>
          </PrevNextButton>
          <PrevNextButton onClick={handleNextClick}>
            <Text>
              {"Next chart "}
              <Text style={{ fontSize: isMobile ? "12px" : "18px" }}>
                ({getNextText()})
              </Text>
            </Text>
            <ArrowRight stroke={mode === "light" ? "#2A2A2A" : "#FFF"} />
          </PrevNextButton>
        </PrevNextButtons>
      )}
    </Container>
  )
}

export default HomeCharts

const ArrowRight = ({ stroke }: { stroke: string }) => (
  <svg
    width="21"
    height="24"
    viewBox="0 0 21 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.96582 12.3207H19.9825M19.9825 12.3207L11.6794 1.14575M19.9825 12.3207L11.6794 23.4956"
      stroke={stroke}
      strokeWidth="1.5"
    />
  </svg>
)

const ArrowLeft = ({ stroke }: { stroke: string }) => (
  <svg
    width="21"
    height="24"
    viewBox="0 0 21 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.0342 12.3207H1.01754M1.01754 12.3207L9.32058 1.14575M1.01754 12.3207L9.32058 23.4956"
      stroke={stroke}
      strokeWidth="1.5"
    />
  </svg>
)

const Text = styled.span`
  margin: 0px 10px;

  @media (max-width: 720px) {
    font-size: 12px;
  }
`

const Container = styled.div`
  position: relative;
`

const PrevNextButtons = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  width: 100%;
  height: 85px;
  border-top: 1px solid ${borderColor};
`

const PrevNextButton = styled.div`
  font-family: FKGrotesk-SemiMono;
  font-size: 22px;
  flex: 1;
  display: flex;

  cursor: pointer;
  align-items: center;
  padding: 0px 20px;

  &:last-of-type {
    border-left: 1px solid ${borderColor};

    justify-content: flex-end;
  }

  &:hover {
    opacity: 0.6;
  }

  @media (max-width: 720px) {
    font-size: 12px;
  }
`

const CircleButtonWrapper = styled.div<{ align: string }>`
  position: absolute;
  top: 46%;
  right: ${(props) => (props.align === "right" ? "2%" : "unset")};
  left: ${(props) => (props.align === "left" ? "2%" : "unset")};
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    opacity: 0.7;
  }
`

type ArrowButtonProps = { onClick: () => void; chartIdx: number }

const getNextChartIdx = (idx: number) => (idx === 7 ? 0 : idx + 1)
const getPrevChartIdx = (idx: number) => (idx === 0 ? 7 : idx - 1)

const ArrowLeftCircle = ({ onClick, chartIdx }: ArrowButtonProps) => {
  const { mode } = useTheme()
  const fill = mode === "dark" ? "#4a4949" : "#2A2A2A"

  return (
    <Tooltip id={`home-chart-${getPrevChartIdx(chartIdx)}`}>
      <CircleButtonWrapper align="left" onClick={onClick}>
        <svg
          width="45"
          height="45"
          viewBox="0 0 45 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="22.5" cy="22.5" r="22.5" fill={fill} />
          <path
            d="M26 15L19 22.5L26 30"
            stroke="white"
            strokeWidth="3"
            strokeLinejoin="bevel"
          />
        </svg>
      </CircleButtonWrapper>
    </Tooltip>
  )
}

const ArrowRightCircle = ({ onClick, chartIdx }: ArrowButtonProps) => {
  const { mode } = useTheme()
  const fill = mode === "dark" ? "#4a4949" : "#2A2A2A"
  return (
    <Tooltip id={`home-chart-${getNextChartIdx(chartIdx)}`}>
      <CircleButtonWrapper align="right" onClick={onClick}>
        <svg
          width="45"
          height="45"
          viewBox="0 0 45 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="22.5" cy="22.5" r="22.5" fill={fill} />
          <path
            d="M20 30L28 22.5L20 15"
            stroke="white"
            strokeWidth="3"
            strokeLinejoin="bevel"
          />
        </svg>
      </CircleButtonWrapper>
    </Tooltip>
  )
}
