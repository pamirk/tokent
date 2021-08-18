import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"

import { Link } from "react-router-dom"
import useOnClickOutside from "helpers/hooks/useOnClickOutside"
import SearchIcon from "utils/search.svg"
import { backgroundColor, tableRowHoverColor, textColor } from "context/theme"
import { ProjectsType, ProjectType } from "types/ApiTypes"
import { useData } from "context/DataContext"
import { getLabelForPrice, getLabelForX } from "helpers/numerals"
import { orderBy } from "lodash"
import { useTheme } from "context/ThemeContext"
import { ArrowUp } from "utils/components/ArrowUp"
import { ArrowDown } from "utils/components/ArrowDown"

const resultSorter = (
  results: ProjectsType,
  key: "name" | "market_cap" | "revenue_30d" | "ps",
  sortOrder: "desc" | "asc"
) =>
  orderBy(
    results,
    [
      (o) => {
        const value = o[key as "name" | "market_cap" | "revenue_30d" | "ps"]
        if (!value && sortOrder === "asc") return Infinity
        if (!value && sortOrder === "desc") return -Infinity

        return value
      },
    ],
    sortOrder
  )

const Search = () => {
  const { projects, isMobile } = useData()
  const { mode } = useTheme()
  const [searchResults, setSearchResults] = useState<ProjectsType>([])
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<string>("")
  const [sortByKey, setSortByKey] = useState<
    "name" | "market_cap" | "revenue_30d" | "ps"
  >("revenue_30d")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const ref = useRef(null)

  useEffect(() => {
    // event listener for escape key press
    const callback = (e: any) => e.keyCode === 27 && setIsOpen(false)
    window.addEventListener("keydown", callback)

    return () => {
      window.removeEventListener("keydown", callback)
    }
  }, [])

  useEffect(() => {
    if (projects) {
      const sortedByRevenue30d = resultSorter(projects, sortByKey, sortOrder)
      setSearchResults(sortedByRevenue30d)
    }
  }, [projects, sortByKey, sortOrder])

  const handleClickOutside = () => setIsOpen(false)

  useEffect(() => {
    if (!projects || filter === "") return

    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(filter.toLowerCase()) ||
        project.symbol.toLowerCase().includes(filter.toLowerCase())
    )
    const sorted = resultSorter(filtered, sortByKey, sortOrder)

    setSearchResults(sorted)
  }, [filter, projects, sortByKey, sortOrder])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value

    setFilter(value)

    if (!isOpen && value.length > 0) setIsOpen(true)
  }

  const handleSortClick = (
    key: "name" | "market_cap" | "revenue_30d" | "ps"
  ) => {
    if (sortByKey === key) {
      return setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }

    setSortByKey(key)
    setSortOrder("desc")
  }

  // Custom hook to detect click outside -> close search results
  useOnClickOutside(ref, handleClickOutside)

  return (
    <Container ref={ref}>
      {isOpen && (
        <GrayBackground onClick={handleClickOutside} isDark={mode === "dark"} />
      )}
      <StyledInput
        type="text"
        placeholder={isMobile ? "Search..." : "Search projects..."}
        onChange={handleFilterChange}
        onClick={() => setIsOpen(!isOpen)}
        value={filter}
      />
      {isOpen && (
        <ResultsContainer>
          <Result style={{ fontFamily: "FKGrotesk-Medium" }}>
            <Column
              style={{ flex: 2 }}
              onClick={() => handleSortClick("name")}
              title="Sort results by project name"
            >
              <Title
                sortByKey={sortByKey}
                sortOrder={sortOrder}
                title="Project"
                titleKey="name"
              />
            </Column>
            <Column
              onClick={() => handleSortClick("market_cap")}
              title="Sort results by market cap"
            >
              <Title
                sortByKey={sortByKey}
                sortOrder={sortOrder}
                title="Market cap"
                titleKey="market_cap"
              />
            </Column>
            <Column
              onClick={() => handleSortClick("revenue_30d")}
              title="Sort results by 30d revenue"
            >
              <Title
                sortByKey={sortByKey}
                sortOrder={sortOrder}
                title="Revenue 30d"
                titleKey="revenue_30d"
              />
            </Column>
            <Column
              onClick={() => handleSortClick("ps")}
              title="Sort results by PS-ratio"
            >
              <Title
                sortByKey={sortByKey}
                sortOrder={sortOrder}
                title="P/S-ratio"
                titleKey="ps"
              />
            </Column>
          </Result>
          <Border />
          {searchResults.length > 0 && (
            <div style={{ overflow: "auto" }}>
              {searchResults.map((result) => (
                <SearchResult
                  key={result.project_id}
                  onClick={() => setIsOpen(false)}
                  project={result}
                />
              ))}
            </div>
          )}
          {searchResults.length === 0 && <Result>{"No results"}</Result>}
        </ResultsContainer>
      )}
    </Container>
  )
}

export default Search

type SearchResultProps = { project: ProjectType; onClick: () => void }

const SearchResult = (props: SearchResultProps) => {
  const { project, onClick } = props

  return (
    <StyledLink
      key={project.name}
      to={`/terminal/projects/${project.project_id}`}
    >
      <Result onClick={onClick}>
        <Column style={{ flex: 2 }}>
          {project.logo && (
            <ResultImg
              src={"https://d2kyooqkgm9ipp.cloudfront.net/" + project.logo}
              alt="Logo"
            />
          )}
          {project.name} {project.symbol ? " (" + project.symbol + ")" : ""}
        </Column>
        <Column>{getLabelForPrice(project.market_cap)}</Column>
        <Column>{getLabelForPrice(project.revenue_30d)}</Column>
        <Column>{getLabelForX(project.ps)}</Column>
      </Result>
    </StyledLink>
  )
}

const Column = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`

const GrayBackground = styled.div<{ isDark: boolean }>`
  position: absolute;
  min-height: 100vh;
  width: 100vw;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, ${(props) => (props.isDark ? 0.5 : 0.3)});
  z-index: -40;
`

const Border = styled.div`
  box-sizing: border-box;
  display: inline-block;
  border: 1px solid #ccc;
  margin: 0px 20px 5px;
  opacity: 0.7;
`

const Container = styled.div<{ isMobile?: boolean }>`
  z-index: 999;
  width: 100%;
  @media (max-width: 720px) {
    width: unset;
  }
`

const StyledInput = styled.input`
  border: 0px;
  padding: 8px 25px;
  width: -webkit-fill-available;
  font-size: 14px;
  line-height: 18px;
  margin: 0px 16px;
  background-position: 10px;
  background-color: ${backgroundColor};
  text-indent: 4px;
  background-image: url(${SearchIcon});
  background-repeat: no-repeat;
  background-position-y: center;
  background-size: 12px;
  color: ${textColor};
  @media (max-width: 720px) {
    width: 100%;
  }
  &:focus {
    outline: none;
  }
  ::placeholder {
    color: #bfbfbf;
  }
`

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  max-height: 50vh;
  overflow: auto;
  background: ${backgroundColor};
  border: 1px solid #00cf9d;
  padding: 4px 0px;
  width: 60%;
  top: 70px;
  margin-left: 18px;
  @media (max-width: 720px) {
    left: 0;
    width: 100%;
  }
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`

const StyledLink = styled(Link)`
  color: rgb(16, 16, 16);
  &:first-of-type {
    margin-top: 4px;
  }
`

const Result = styled.div`
  padding: 8px 30px;
  cursor: pointer;
  color: ${textColor};
  display: flex;
  align-content: center;
  &:hover {
    background-color: ${tableRowHoverColor};
  }
`

const ResultImg = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
`

type TitleProps = {
  sortByKey: string
  sortOrder: string
  titleKey: string
  title: string
}

const Title = ({ sortByKey, sortOrder, titleKey, title }: TitleProps) => (
  <>
    <span
      style={{
        marginRight: sortByKey === titleKey ? "5px" : "0px",
      }}
    >
      {title}
    </span>
    {sortByKey === titleKey ? (
      sortOrder === "desc" ? (
        <ArrowDown />
      ) : (
        <ArrowUp />
      )
    ) : null}
  </>
)
