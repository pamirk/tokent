import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Link, useLocation } from "react-router-dom"
import ArrowUp from "utils/arrowUp.svg"
import ArrowLeft from "utils/arrowLeft.svg"
import ArrowRight from "utils/arrowRight.svg"
import ArrowDown from "utils/arrowDown.svg"
import About from "utils/about.svg"
import Insights from "utils/insights.svg"
import LogoIconBlack from "utils/logo/logo.svg"
import LogoIconWhite from "utils/logo/logo-multiline-white.svg"
import LogoSmallIconBlack from "utils/logo/logo-compact.svg"
import LogoSmallIconWhite from "utils/logo/logo-compact-white.svg"
import Tooltip from "components/generic/tooltip/Tooltip"
import { borderColor, scrollBarColor } from "context/theme"
import { useTheme } from "context/ThemeContext"
import SampleData from "./SampleData"
import ProjectsIcon from "components/generic/icons/ProjectsIcon"
import MarketsIcon from "components/generic/icons/MarketsIcon"
import BarChartIcon from "components/generic/icons/BarChartIcon"
import HomeIcon from "components/generic/icons/HomeIcon"

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
  onSidebarToggle: (value: boolean) => void
}

const Sidebar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(
    !window.location.pathname.includes("/terminal/tables/")
  )
  const { mode } = useTheme()

  const { markets, metrics, projects, onSidebarToggle } = props

  useEffect(() => {
    onSidebarToggle(isOpen)
  }, [onSidebarToggle, isOpen])

  const logo = mode === "light" ? LogoIconBlack : LogoIconWhite
  const logoSmall = mode === "light" ? LogoSmallIconBlack : LogoSmallIconWhite
  return (
    <Container isOpen={isOpen}>
      <LogoRow isOpen={isOpen}>
        <Logo to="/">
          <LogoImg
            isOpen={isOpen}
            // src={isOpen ? logo : logoSmall}
            src={ logoSmall}
            alt="Logo"
            height="24px"
          />
        </Logo>
        <ToggleSideBarArrow
          isOpen={isOpen}
          onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
          src={isOpen ? ArrowLeft : ArrowRight}
          alt="Toggle visibility"
        />
      </LogoRow>
      <Wrapper>
        <SidebarTop>
          <SidebarSection
            title="Home"
            href="/"
            icon={<HomeIcon />}
            isOpen={isOpen}
            tooltipId="sidebar-home"
          />
          <SidebarSection
            title="Metrics"
            items={metrics}
            icon={<BarChartIcon />}
            isOpen={isOpen}
            tooltipId="sidebar-metrics"
          />
         {/* <SidebarSection
            title="Markets"
            items={markets}
            icon={<MarketsIcon />}
            isOpen={isOpen}
            tooltipId="sidebar-markets"
          />
          <SidebarSection
            title="Projects"
            items={projects}
            icon={<ProjectsIcon />}
            isOpen={isOpen}
            tooltipId="sidebar-projects"
          />*/}
        </SidebarTop>
   {/*     <SidebarBottom>
          <SidebarSection
            title="Insights"
            href="https://tokenterminal.substack.com/"
            icon={Insights}
            isOpen={isOpen}
            tooltipId="sidebar-insights"
          />
          <SidebarSection
            title="About"
            href="https://docs.tokenterminal.com/"
            icon={About}
            isOpen={isOpen}
            tooltipId="sidebar-about"
          />
          {isOpen && <SampleData />}
        </SidebarBottom>*/}
      </Wrapper>
    </Container>
  )
}

const SidebarSection = (props: {
  title: string
  items?: SidebarItem[]
  href?: string
  icon?: string | React.ReactElement
  isOpen: boolean
  tooltipId: string
}) => {
  const { mode } = useTheme()
  const selectedTitleColor = mode === "light" ? "#000" : "#FFF"
  const { title, items, href, icon, isOpen, tooltipId } = props
  const [sectionIsOpen, setSectionIsOpen] = useState(title === "Projects")

  const { pathname } = useLocation()
  const sectionId = pathname.split("/")[3]

  const isSelected = pathname.includes(title.toLowerCase())

  const titleStyle = isSelected
    ? { color: selectedTitleColor, lineHeight: "18px" }
    : {}

  const containerStyle =
    title === "Projects" ? { display: "flex", overflow: "auto" } : {}

  if (items) {
    return (
      <SectionContainer style={containerStyle}>
        <SectionTitle
          onClick={() => setSectionIsOpen((prevIsOpen) => !prevIsOpen)}
        >
          {typeof icon === "string" && <TitleIcon src={icon} alt={title} />}
          {typeof icon !== "string" &&
            icon &&
            React.cloneElement(icon, {
              fill: isSelected ? "#00cf9d" : "#A3A5A8",
            })}

          {isOpen && (
            <>
              <Tooltip id={tooltipId} width="120px">
                <Text style={titleStyle}>{title}</Text>
              </Tooltip>
              <Arrow
                src={sectionIsOpen ? ArrowDown : ArrowUp}
                alt="Toggle visibility"
              />
            </>
          )}
        </SectionTitle>
        {isOpen && sectionIsOpen && items.length > 0 && (
          <SectionItems>
            {items.map((item) => (
              <Link key={item.name} to={`/terminal/${item.prefix}/${item.id}`}>
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
  if (title === "Home" && href) {
    const style = {
      background: "rgb(196 196 196 / 10%)",
      border: `1px solid ${borderColor}`,
      borderRight: "none",
      padding: "5px 0px",
    }
    return (
      <SectionContainer style={style}>
        <Link to={href}>
          <SectionTitle>
            {typeof icon !== "string" &&
              icon &&
              React.cloneElement(icon, {
                fill: isSelected ? "#00cf9d" : "#A3A5A8",
              })}
            {isOpen && (
              <Tooltip id={tooltipId} width="120px">
                <Text style={titleStyle}>{title}</Text>
              </Tooltip>
            )}
          </SectionTitle>
        </Link>
      </SectionContainer>
    )
  }

  if (href) {
    return (
      <SectionContainer>
        <a href={href} target="_blank" rel="noreferrer">
          <SectionTitle>
            {typeof icon === "string" && <TitleIcon src={icon} alt={title} />}
            {typeof icon !== "string" &&
              icon &&
              React.cloneElement(icon, {
                fill: isSelected ? "#00cf9d" : "#A3A5A8",
              })}
            {isOpen && (
              <Tooltip id={tooltipId} width="120px">
                <Text style={titleStyle}>{title}</Text>
              </Tooltip>
            )}
          </SectionTitle>
        </a>
      </SectionContainer>
    )
  }

  return null
}

export default Sidebar

const LogoImg = styled.img<{ isOpen: boolean }>`
  width: ${(props) => (props.isOpen ? "144px" : "20px")};
  height: ${(props) => (props.isOpen ? "30px" : "20px")};
`
const ToggleSideBarArrow = styled.img<{ isOpen: boolean }>`
  margin-left: ${(props) => (props.isOpen ? "0px" : "15px")};
  margin-right: 8px;
  margin-top: ${(props) => (props.isOpen ? "10px" : "12px")};
  margin-bottom: ${(props) => (props.isOpen ? "10px" : "8px")};
  width: 16px;
  height: 16px;

  display: block;
  cursor: pointer;

  &:hover {
    margin-right: ${(props) => (props.isOpen ? "10px" : "8px")};
  }
`
const Arrow = styled.img`
  cursor: pointer;
  margin-left: 8px;
`

const Text = styled.span`
  font-size: 15px;
  line-height: 16px;
  font-family: FKGrotesk-Medium;
  margin-left: 10px;
`

const TitleIcon = styled.img`
  margin-right: 6px;
  width: 14px;
  height: 14px;
`

const Container = styled.div<{ isOpen: boolean }>`
  border: 1px solid ${borderColor};
  border-top: none;
  height: 100%;
  width: ${(props) => (props.isOpen ? "238px" : "56px")};
  position: fixed;
  z-index: 101;
  top: 0;
  left: 0;
  overflow-x: hidden;
`

const Wrapper = styled.div`
  height: calc(100% - 76px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SectionContainer = styled.div`
  flex-direction: column;
`

const SectionTitle = styled.div<{ isSelected?: boolean }>`
  display: flex;

  cursor: pointer;

  padding: 5px 0px 4px 16px;

  background: ${(props) => (props.isSelected ? "#00CF9D" : "")};

  font-weight: ${(props) => (props.isSelected ? 500 : 400)};

  color: ${(props) => (props.isSelected ? "#FFFF" : "#858585")};

  &:hover {
    opacity: 0.7;
  }
`

const SectionItems = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  font-size: 11px;

  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${scrollBarColor};
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`

const SectionItem = styled.div<{ isSelected: boolean }>`
  text-decoration: none;

  font-weight: ${(props) => (props.isSelected ? "500" : "normal")};
  font-size: 13px;

  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  background: ${(props) => (props.isSelected ? "#00CF9D" : "")};

  padding-left: 47px;

  color: ${(props) => (props.isSelected ? "#FFFF" : "#858585")};

  &:hover {
    opacity: 0.7;
  }
`

const Logo = styled(Link)`
  display: flex;
  margin-left: 15px;
`

const LogoRow = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isOpen ? "row" : "column")};
  align-items: ${(props) => (props.isOpen ? "center" : "flex-start")};
  justify-content: space-between;
  padding: ${(props) => (props.isOpen ? "8px 0px" : "8px 0px 5px 0px")};
  height: ${(props) => (props.isOpen ? "48px" : "52px")};
`

const SidebarBottom = styled.div`
  margin-top: 30px;
`

const SidebarTop = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
