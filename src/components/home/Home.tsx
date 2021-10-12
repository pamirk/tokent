import React, { useEffect } from "react"

import Explore from "components/home/explore/Explore"
import OverviewTable from "./overview/overviewTable/OverviewTable"
import BottomCards from "./bottom/BottomCards"
import HomeCharts from "./charts/HomeCharts"

const Home = () => {
  document.title = "Crypto | Home"
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Explore />
      {/*<HomeCharts />*/}
      <OverviewTable />
      {/*<BottomCards />*/}
    </>
  )
}

export default Home
