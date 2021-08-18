import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"

import { Link } from "react-router-dom"
import useOnClickOutside from "helpers/hooks/useOnClickOutside"
import { SidebarItem } from "components/sidebar/Sidebar"
import SearchIcon from "utils/search.svg"
import { backgroundColor, tableRowHoverColor, textColor } from "context/theme"
type Props = {
  projects: SidebarItem[]
  markets: SidebarItem[]
  metrics: SidebarItem[]
}

type SearchItems = {
  keyword: string
  url: string
  logo?: string
  name: string
}[]

const SearchMobile = (props: Props) => {
  const { projects, markets, metrics } = props
  const [keywords, setKeywords] = useState<SearchItems>([])
  const [searchResults, setSearchResults] = useState<SearchItems>([])
  const [filter, setFilter] = useState<string>("")
  const ref = useRef(null)

  useEffect(() => {
    setKeywords(
      projects
        .concat(markets)
        .concat(metrics)
        .map((item) => ({
          name: `${item.name} ${item.symbol ? `(${item.symbol})` : ""}`,
          keyword: `${item.name} ${item.symbol || ""}`.toLowerCase(),
          logo: item.logo || undefined,
          url: `/terminal/${item.prefix}/${item.id}`,
        }))
    )
  }, [projects, markets, metrics])

  useEffect(() => {
    if (filter !== "") {
      const results = keywords.filter((entry) =>
        entry.keyword.includes(filter.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [filter, keywords])

  const handleClickOutside = () => {
    setSearchResults([])
  }

  const handleResultClick = () => {
    setFilter("")
    setSearchResults([])
  }

  // Custom hook to detect click outside -> close search results
  useOnClickOutside(ref, handleClickOutside)

  return (
    <Container ref={ref}>
      <StyledInput
        type="text"
        placeholder={"Search metrics, markets, and projects..."}
        onChange={(e) => setFilter(e.currentTarget.value)}
        value={filter}
      />
      <ResultsContainer>
        {searchResults.map((result) => (
          <StyledLink key={result.name} to={result.url}>
            <Result onClick={handleResultClick}>
              {result.logo && (
                <ResultImg
                  src={"https://d2kyooqkgm9ipp.cloudfront.net/" + result.logo}
                  alt="Logo"
                />
              )}
              {result.name}
            </Result>
          </StyledLink>
        ))}
      </ResultsContainer>
    </Container>
  )
}

export default SearchMobile

const Container = styled.div<{ isMobile?: boolean }>`
  z-index: 999;
  width: 100%;

  @media (max-width: 720px) {
    width: unset;
  }
`

const StyledInput = styled.input`
  border: 0px;
  padding: 8px 16px;
  width: 500px;
  max-width: 500px;
  font-size: 14px;
  line-height: 18px;
  margin-left: 16px;

  background-color: transparent;
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
  width: 40%;
  max-height: 280px;
  overflow: auto;
  background: ${backgroundColor};

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
  padding: 8px;
  cursor: pointer;
  color: ${textColor};

  &:hover {
    background-color: ${tableRowHoverColor};
  }
`

const ResultImg = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
`
