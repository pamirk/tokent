import { getMarkets } from "api/ApiCalls"
import {
  backgroundColor,
  borderColor,
  scrollBarColor,
  textColor,
} from "context/theme"
import { debounce } from "lodash"
import React, { useMemo } from "react"
import { useState } from "react"
import { useEffect } from "react"
import styled from "styled-components"
import { FeedItemType } from "types/ApiTypes"
import DragIcon from "./DragIcon"
import FeedIcon from "utils/feedIcon.svg"
import ArrowRight from "utils/arrowRight.svg"
import Resize from "components/generic/resize/Resize"
import FeedItem from "./FeedItem"
import SearchIcon from "utils/search.svg"
import { useData } from "context/DataContext"
import { Redirect } from "react-router-dom"
import Momentum from "./Momentum"

const ResizeHandlerStyle = {
  margin: "0px 10px",
  cursor: "grab",
  display: "flex",
  alignItems: "center",
}

type Props = { updateWidth: (width: number) => void }
const Feed = (props: Props) => {
  const { updateWidth } = props

  const { isMobile, projects } = useData()

  const [limit, setLimit] = useState(30)
  const [feed, setFeed] = useState<FeedItemType[]>([])
  const [filtered, setFiltered] = useState<FeedItemType[]>([])
  const [isOpen, setIsOpen] = useState(true)
  const [keyword, setKeyword] = useState("")

  const items = filtered.slice(0, limit)

  const containerRef = React.useRef<any>()

  const updateAppWidth = useMemo(
    () => debounce((width) => updateWidth(width), 500),
    [updateWidth]
  )

  const handleResize = (newWidth: number) => {
    if (newWidth < 238) {
      updateAppWidth(newWidth)
    }
  }

  const handleToggleClick = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    if (newIsOpen) {
      updateAppWidth(238)
      containerRef.current.style.width = "238px"
    } else {
      updateAppWidth(50)
      containerRef.current.style.width = "50px"
    }
  }

  useEffect(() => {
    const kw = keyword.toLowerCase()

    const results = feed.filter((item) => {
      if (
        item.category.toLowerCase().includes(kw) ||
        item.desc.toLowerCase().includes(kw) ||
        item.itemTitle.toLowerCase().includes(kw) ||
        item.title.toLowerCase().includes(kw)
      ) {
        return true
      }

      return false
    })

    setFiltered(results)
  }, [keyword, feed])

  useEffect(() => {
    getMarkets().then((data) => {
      const withTitles = data
        .filter((p) => p.source === "forum")
        .map((p) => {
          const project = projects?.find(
            (project) => p.id === project.project_id
          )

          const title = project ? project.name + " forum" : p.title
          return { ...p, title }
        })

      setFeed(withTitles)
      setFiltered(withTitles)
    })
  }, [projects])

  if (!isMobile && window.location.pathname === "/markets-feed") {
    return <Redirect to="/" />
  }

  if (!isOpen) {
    return (
      <Container ref={containerRef} isOpen={isOpen}>
        <OpenMenu title="Open menu" onClick={handleToggleClick}>
          <img alt="Feed" src={FeedIcon} />
        </OpenMenu>
      </Container>
    )
  }
  return (
    <Container ref={containerRef} isOpen={isOpen}>
      <Menu>
        {!isMobile && (
          <Resize
            style={ResizeHandlerStyle}
            onResize={handleResize}
            disabled={!isOpen}
            refComponent={containerRef}
            maxWidth={600}
            minWidth={150}
          >
            <DragIcon />
          </Resize>
        )}
        <Title>
          <img alt="Feed" src={FeedIcon} />
          <TitleText>{"Live feed"}</TitleText>
        </Title>
        {!isMobile && (
          <ToggleArrow
            isOpen={isOpen}
            onClick={handleToggleClick}
            src={ArrowRight}
            alt="Toggle visibility"
          />
        )}
      </Menu>
      <Search
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search..."
      />
      <Content>
        {keyword === "" && <Momentum />}
        {items.map((item, index) => (
          <FeedItem key={item.date + index} keyword={keyword} data={item} />
        ))}
        {filtered.length > 0 &&
          filtered.length >= limit &&
          filtered.length <= feed.length && (
            <LoadMore onClick={() => setLimit(limit + 30)}>
              {"Load more..."}
            </LoadMore>
          )}
        {filtered.length === 0 && (
          <LoadMore style={{ cursor: "default" }}>
            {feed.length > 0 ? "No results" : "Loading feed..."}
          </LoadMore>
        )}
      </Content>
    </Container>
  )
}

export default Feed

const Search = styled.input`
  border: 0px;
  padding: 8px 25px;
  width: -webkit-fill-available;
  font-size: 14px;
  line-height: 18px;
  margin: 0px 5px;
  background-position: 10px;
  background-color: ${backgroundColor};
  text-indent: 4px;
  background-image: url(${SearchIcon});
  background-repeat: no-repeat;
  background-position-y: center;
  background-size: 12px;
  color: ${textColor};

  &:focus {
    outline: none;
  }
  ::placeholder {
    color: #bfbfbf;
  }
`

const Container = styled.div<{ isOpen: boolean }>`
  width: ${(props) => (props.isOpen ? "238px" : "50px")};
  background: ${backgroundColor};
  border-left: 1px solid ${borderColor};
  height: calc(100% - 65px);
  position: fixed;
  z-index: 5;
  top: 0;
  right: 0;
  margin-top: 65px;

  @media (max-width: 720px) {
    width: unset;
    position: unset;
    margin-top: unset;
  }
`

const Menu = styled.div`
  display: flex;

  @media (max-width: 720px) {
    position: sticky;
  }
`

const Content = styled.div`
  overflow: auto;
  height: calc(100% - 80px);
  border-top: 1px solid ${borderColor};

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

const Title = styled.div`
  padding: 10px 5px;
  margin-top: 2px;
  font-family: FKGrotesk-SemiMono;
  font-style: normal;
  font-weight: bold;

  @media (max-width: 720px) {
    margin-left: 10px;
  }
`

const TitleText = styled.span`
  position: relative;
  top: -3px;
  margin-left: 10px;
`

const OpenMenu = styled.div`
  margin-left: 18px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`

const LoadMore = styled.div`
  padding: 20px;
  display: flex;
  cursor: pointer;
  border-top: 1px solid ${borderColor};

  &:hover {
    opacity: 0.8;
  }
`
const ToggleArrow = styled.img<{ isOpen: boolean }>`
  float: right;
  margin-left: auto;
  margin-right: 8px;

  display: block;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`
