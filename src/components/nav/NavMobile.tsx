import React, { useState } from "react"
import styled from "styled-components"
import { Link, useLocation } from "react-router-dom"
import ArrowUp from "utils/arrowUp.svg"
import MobileNavToggle from "utils/mobile-nav-toggle.svg"
import ArrowDown from "utils/arrowDown.svg"
import About from "utils/about.svg"
import Home from "utils/home.svg"
import Suitcase from "utils/suitcase.svg"
import Barchart from "utils/barchart.svg"
import Markets from "utils/markets.svg"
import Projects from "utils/projects.svg"
import Insights from "utils/insights.svg"
import HandIcon from "utils/hand.svg"
import LogoIconBlack from "utils/logo/logo.svg"
import LogoIconWhite from "utils/logo/logo-white.svg"
import LogoSmallIconBlack from "utils/logo/logo-compact.svg"
import LogoSmallIconWhite from "utils/logo/logo-compact-white.svg"
import Tooltip from "components/generic/tooltip/Tooltip"
import SearchIcon from "utils/search.svg"
import { borderColor } from "context/theme"
import { useTheme } from "context/ThemeContext"
import ColorToggle from "components/sidebar/ColorToggle"
import { useAuth } from "context/AuthContext"
import SampleData from "components/sidebar/SampleData"
import SearchMobile from "./SearchMobile"
import FeedIcon from "utils/feedIcon.svg"

export type SidebarItem = {
  name: string
  id: string
  prefix: string
  symbol?: string
  logo?: string
}
type Props = {
  projects: SidebarItem[]
  markets: SidebarItem[]
  metrics: SidebarItem[]
  isLoggedIn: boolean
}

const NavMobile = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { isLoggedIn, user } = useAuth()
  const { markets, metrics, projects } = props

  const { mode } = useTheme()
  const logo = mode === "light" ? LogoIconBlack : LogoIconWhite
  const logoSmall = mode === "light" ? LogoSmallIconBlack : LogoSmallIconWhite

  return (
    <Container>
      <NavWrapper>
        <LogoRow>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Logo to="/">
              <LogoImg
                src={!isSearchOpen ? logo : logoSmall}
                alt="Logo"
                style={{
                  height: "48px",
                  width: isSearchOpen ? "24px" : "144px",
                }}
              />
            </Logo>
            {isSearchOpen && (
              <SearchMobile
                projects={projects}
                markets={markets}
                metrics={metrics}
              />
            )}
          </div>
          <div style={{ display: "flex" }}>
            <ToggleSideBarArrow
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              src={SearchIcon}
              alt="Search"
            />
            <ToggleSideBarArrow
              onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
              src={MobileNavToggle}
              alt="Toggle visibility"
            />
          </div>
        </LogoRow>
        {isOpen && (
          <Wrapper>
            <SidebarSection
              title="Home"
              href="/"
              icon={Home}
              tooltipId="sidebar-home"
              hide={() => setIsOpen(false)}
            />
            {isLoggedIn && !!user.id && (
              <SidebarSection
                title="Account"
                href="/account"
                icon={Suitcase}
                hide={() => setIsOpen(false)}
              />
            )}
            {!isLoggedIn && (
              <SidebarSection
                title="Login "
                href="/login"
                icon={HandIcon}
                hide={() => setIsOpen(false)}
              />
            )}

            <SidebarSection
              title="Metrics"
              items={metrics}
              icon={Barchart}
              tooltipId="sidebar-metrics"
              hide={() => setIsOpen(false)}
            />
            <SidebarSection
              title="Markets"
              items={markets}
              icon={Markets}
              tooltipId="sidebar-markets"
              hide={() => setIsOpen(false)}
            />
            <SidebarSection
              title="Projects"
              items={projects}
              icon={Projects}
              tooltipId="sidebar-projects"
              hide={() => setIsOpen(false)}
            />
            <SidebarSection
              title="Markets feed"
              href="/markets-feed"
              icon={FeedIcon}
              hide={() => setIsOpen(false)}
            />
            <SidebarSection
              title="Insights"
              href="https://tokenterminal.substack.com/"
              icon={Insights}
              tooltipId="sidebar-insights"
              hide={() => setIsOpen(false)}
            />
            <SidebarSection
              title="About"
              href="https://docs.tokenterminal.com/"
              icon={About}
              tooltipId="sidebar-about"
              hide={() => setIsOpen(false)}
            />
            <ColorToggle isOpen={isOpen} />
            <SampleData />
          </Wrapper>
        )}
      </NavWrapper>
    </Container>
  )
}

const SidebarSection = (props: {
  title: string
  items?: SidebarItem[]
  href?: string
  icon?: string
  tooltipId?: string
  hide: () => void
}) => {
  const { mode } = useTheme()
  const selectedTitleColor = mode === "light" ? "#000" : "#FFF"

  const [sectionIsOpen, setSectionIsOpen] = useState(true)
  const { title, items, href, icon, tooltipId, hide } = props
  const { pathname } = useLocation()
  const sectionId = pathname.split("/")[3]

  const titleStyle =
    pathname.includes(title.toLowerCase()) || title === "Home"
      ? { color: selectedTitleColor }
      : {}

  if (items) {
    return (
      <SectionContainer>
        <SectionTitle
          onClick={() => setSectionIsOpen((prevIsOpen) => !prevIsOpen)}
        >
          <TitleIcon src={icon} alt={title} />

          <Tooltip id={tooltipId} width="150px">
            <Text style={titleStyle}>{title}</Text>
          </Tooltip>
          <Arrow
            src={sectionIsOpen ? ArrowDown : ArrowUp}
            alt="Toggle visibility"
          />
        </SectionTitle>
        {sectionIsOpen && items.length > 0 && (
          <SectionItems>
            {items.map((item) => (
              <Link
                key={item.name}
                onClick={hide}
                to={`/terminal/${item.prefix}/${item.id}`}
              >
                <SectionItem isSelected={sectionId === item.id} key={item.id}>
                  {item.name}
                </SectionItem>
              </Link>
            ))}
          </SectionItems>
        )}
      </SectionContainer>
    )
  }
  if (href) {
    const style =
      title === "Home"
        ? {
            background: "rgb(196 196 196 / 10%)",
            borderBottom: `1px solid ${borderColor}`,
            padding: "5px 0px",
          }
        : {}
    return (
      <SectionContainer style={style}>
        <a href={href}>
          <SectionTitle>
            <TitleIcon src={icon} alt={title} />
            <Tooltip id={tooltipId} width="120px">
              <Text style={titleStyle}>{title}</Text>
            </Tooltip>
          </SectionTitle>
        </a>
      </SectionContainer>
    )
  }

  return null
}

export default NavMobile

const LogoImg = styled.img`
  width: 144px;
  height: 48px;
`
const ToggleSideBarArrow = styled.img`
  margin-right: 20px;
  width: 16px;
  height: 16px;

  display: block;
  cursor: pointer;
`
const Arrow = styled.img`
  cursor: pointer;
  margin-left: 8px;
`

const Text = styled.span`
  font-size: 13px;
  line-height: 16px;
  font-family: FKGrotesk-Medium;
`

const TitleIcon = styled.img`
  margin-right: 4px;
  width: 14px;
  height: 14px;
`

const Container = styled.div`
  height: 100%;
  width: 100%;
  z-index: 2;
  overflow-x: hidden;
`

const Wrapper = styled.div`
  border-top: 1px solid ${borderColor};
  margin-bottom: 10px;
`

const SectionContainer = styled.div`
  margin-bottom: 8px;
`

const SectionTitle = styled.div<{ isSelected?: boolean }>`
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;

  display: flex;

  cursor: pointer;

  padding: 4px 0px 4px 16px;

  background: ${(props) => (props.isSelected ? "#00CF9D" : "")};

  font-weight: ${(props) => (props.isSelected ? 500 : 400)};

  color: ${(props) => (props.isSelected ? "#FFFF" : "#858585")};
`

const SectionItems = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow-y: auto;
  font-size: 11px;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`

const SectionItem = styled.div<{ isSelected: boolean }>`
  text-decoration: none;

  font-weight: ${(props) => (props.isSelected ? "500" : "normal")};
  font-size: 13px;
  line-height: 16px;

  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  background: ${(props) => (props.isSelected ? "#00CF9D" : "")};

  padding-left: 47px;

  color: ${(props) => (props.isSelected ? "#FFFF" : "#858585")};
`

const Logo = styled(Link)`
  display: flex;
  margin-left: 20px;
`

const LogoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0px;
`

const NavWrapper = styled.div`
  border-bottom: 1px solid ${borderColor};
`
