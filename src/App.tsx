import React, {useState, useEffect} from "react"
import styled from "styled-components"
import NavHeader from "components/nav/NavHeader"
import {useAuth} from "context/AuthContext"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Sidebar from "components/sidebar/Sidebar"
import {Routes} from "config/Routes"
import {useTheme} from "context/ThemeContext"
import LogoDark from "utils/animation/chart-loading-dark.gif"
import LogoLight from "utils/animation/chart-loading-light.gif"
import {useData} from "context/DataContext"
import SocketProvider from "context/SocketContext"
import Footer from "components/footer/Footer"
import Feed from "components/feed/Feed"
import FooterDevBy from "./components/footer/FooterDevBy";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(
        window.location.pathname.includes("/terminal/tables/")
    )
    const {toggle, mode} = useTheme()
    const {login} = useAuth()
    const {projects, markets, revenueProtocol, errorMsg, isMobile} = useData()

    const [marginRight, setMarginRight] = useState(240)
    useEffect(() => {
        const theme = localStorage.getItem("mode")

        if (theme && mode !== theme) {
            toggle()
        }

        const storedData = JSON.parse(localStorage.getItem("userData") || "{}")
        if (storedData && storedData.token) {
            login(storedData.token)
        }
    }, [mode, login, toggle])

    if (errorMsg) {
        return (
            <Error>
                <h1>{"Error"}</h1>
                <span>{errorMsg.toString()}</span>
            </Error>
        )
    }

    if (!(projects && markets && revenueProtocol)) {
        return (
            <Loading>
                <img
                    style={{height: isMobile ? "75px" : "250px"}}
                    src={mode === "light" ? LogoLight : LogoDark}
                    alt="Loading"
                />
            </Loading>
        )
    }

    const allProjects = projects
        .filter((project) =>
            Object.values(project.metric_availability).includes(true)
        )
        .map((project) => ({
            name: project.name,
            id: project.project_id,
            prefix: "projects",
            symbol: project.symbol,
            logo: project.logo,
        }))

    const allMarkets = markets.map((market) => ({
        name: market.market,
        id: market.market_id,
        prefix: "markets",
    }))

    const allMetrics = [
        {name: "Total revenue", id: "revenue", prefix: "metrics"},
        {name: "Protocol revenue", id: "protocol_revenue", prefix: "metrics"},
        {name: "Price to sales (P/S) ratio", id: "ps", prefix: "metrics"},
        {name: "Price to earnings (P/E) ratio", id: "pe", prefix: "metrics"},
        {name: "Total value locked (TVL)", id: "tvl", prefix: "metrics"},
    ]

    const isEmbed = window.location.pathname.includes("/embed/")

    if (!isEmbed) {
        return (
            <>
                <Container>
                    <Router>
                        <NavHeader
                            projects={allProjects}
                            markets={allMarkets}
                            metrics={allMetrics}
                            isMobile={isMobile}
                            isSidebarOpen={isSidebarOpen}
                        />
                        {!isMobile && (
                            <>
                                <Sidebar
                                    projects={allProjects}
                                    markets={allMarkets}
                                    metrics={allMetrics}
                                    onSidebarToggle={setIsSidebarOpen}
                                />
                                {/*<Feed updateWidth={setMarginRight} />*/}
                            </>
                        )}
                        <SocketProvider>
                            <AppContainer
                                isSidebarOpen={isSidebarOpen}
                                isMobile={isMobile}
                                marginRight={0}
                            >
                                <Switch>
                                    {Routes.map(({path, component: Component}) => (
                                        <Route
                                            key={path}
                                            path={path}
                                            render={() => <Component updateWidth={setMarginRight}/>}
                                        />
                                    ))}
                                </Switch>
                            </AppContainer>
                        </SocketProvider>
                    </Router>
                    <Footer
                        marginLeft={isSidebarOpen ? 239 : 57}
                        marginRight={marginRight}
                    />
                </Container>
                <FooterDevBy/>
            </>

        )
    }

    return (
        <Container>
            <Router>
                <Switch>
                    {Routes.map(({path, component: Component}) => (
                        <Route
                            key={path}
                            path={path}
                            render={() => <Component updateWidth={setMarginRight}/>}
                        />
                    ))}
                </Switch>
            </Router>

        </Container>
    )
}

export default App

const AppContainer = styled.div<{
    isSidebarOpen: boolean
    isMobile: boolean
    marginRight: number
}>`
  padding: ${(props) => (props.isMobile ? "0px" : "64px 0px 0px")};
  margin-left: ${(props) =>
    props.isMobile ? "0px" : props.isSidebarOpen ? "240px" : "58px"};
  margin-right: ${(props) =>
    props.isMobile ? "0px" : props.marginRight + "px"};
`

const Loading = styled.div`
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Error = styled.div`
  left: 50%;
  top: 50%;
  position: absolute;
  margin-top: -50px;
  margin-left: -90px;
  color: #eb5858;
  text-align: center;
`

const Container = styled.div``
