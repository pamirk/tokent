import {
  fetchMarkets,
  fetchProjects,
  fetchProtocolRevenueMetrics,
} from "api/ApiCalls"
import React, { useEffect, useState } from "react"
import { ProjectsType, MarketsType, RevenueMetricsType } from "types/ApiTypes"

type DataContextType = {
  projects: ProjectsType | undefined
  markets: MarketsType | undefined
  revenueProtocol: RevenueMetricsType | undefined
  errorMsg: string | undefined
  isMobile: boolean
}

export const DataContext = React.createContext<DataContextType>({
  projects: undefined,
  markets: undefined,
  revenueProtocol: undefined,
  errorMsg: undefined,
  isMobile: false,
})

export const useData = () => React.useContext(DataContext)

export const DataProvider = ({ children }: any) => {
  const [projects, setProjects] = useState<undefined | ProjectsType>(undefined)
  const [markets, setMarkets] = useState<undefined | MarketsType>(undefined)
  const [revenueProtocol, setRevenueProtocol] = useState<
    RevenueMetricsType | undefined
  >(undefined)
  const [errorMsg, setErrorMsg] = useState<undefined | string>(undefined)
  const [width, setWidth] = useState(document.body.clientWidth)

  useEffect(() => {
    let isCanceled = false

    fetchProjects()
      .then((data) => !isCanceled && setProjects(data))
      .catch(setErrorMsg)
    fetchMarkets()
      .then((data) => !isCanceled && setMarkets(data))
      .catch(setErrorMsg)
    fetchProtocolRevenueMetrics("daily").then(
      (data) => !isCanceled && setRevenueProtocol(data)
    )

    return () => {
      isCanceled = true
    }
  }, [])

  const updateWidth = () => {
    if (!document.body) return

    if (
      (width > 720 && document.body.clientWidth <= 720) ||
      (width <= 720 && document.body.clientWidth > 720)
    ) {
      setWidth(document.body.clientWidth)
    }
  }

  // event listener for page resize so we know when to render mobile / desktop header
  useEffect(() => {
    window.addEventListener("resize", updateWidth)

    return () => {
      window.removeEventListener("resize", updateWidth)
    }
  })

  return (
    <DataContext.Provider
      value={{
        projects,
        markets,
        revenueProtocol,
        errorMsg,
        isMobile: width < 720,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export default DataProvider
