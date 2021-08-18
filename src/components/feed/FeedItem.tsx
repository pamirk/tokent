import { useData } from "context/DataContext"
import { borderColor } from "context/theme"
import { timeSince } from "helpers/date"
import { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { FeedItemType } from "types/ApiTypes"

type Props = { data: FeedItemType; keyword: string }

const FeedItem = (props: Props) => {
  const { data, keyword } = props
  const { projects } = useData()
  const [showFullDesc, setShowFullDesc] = useState(false)

  const getTimeAgo = (time: string) => {
    try {
      return timeSince(new Date(time), true)
    } catch {
      return "-"
    }
  }

  const getTitle = () => {
    const project = projects?.find((p) => p.project_id === data.id)

    if (project) {
      return project.name + " forum"
    }

    const parsed = data.title.split("- Latest topics")[0]
    if (parsed.toLowerCase().includes("forum")) {
      return parsed
    }

    return parsed + " forum"
  }

  const getHighlightedText = (text: string, highlight: string) => {
    if (keyword === "") return text
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"))
    return (
      <span>
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { backgroundColor: "#c7efe3", fontWeight: "bold" }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    )
  }

  return (
    <ItemContainer>
      <TitleWrapper>
        <ItemTitle to={`/terminal/projects/${data.id}`}>
          {data.logo !== "" && (
            <SmallLogo
              src={"https://d2kyooqkgm9ipp.cloudfront.net/" + data.logo}
            />
          )}
          {getHighlightedText(getTitle(), keyword)}
        </ItemTitle>
        <Time>{getTimeAgo(data.date)}</Time>
      </TitleWrapper>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => !showFullDesc && setShowFullDesc(true)}
      >
        <ItemSubtitle>
          {getHighlightedText(`${data.category}: ${data.itemTitle}`, keyword)}
        </ItemSubtitle>
        <ItemDesc>
          {showFullDesc
            ? getHighlightedText(data.desc, keyword)
            : getHighlightedText(data.desc.substring(0, 120), keyword)}
        </ItemDesc>
      </div>
      <BottomRow>
        <ReadMore onClick={() => setShowFullDesc(!showFullDesc)}>
          {showFullDesc ? "Show less" : "Read more"}
        </ReadMore>
        {showFullDesc && (
          <UrlLink href={data.link} target="_blank">
            {"Link to post"}
          </UrlLink>
        )}
      </BottomRow>
    </ItemContainer>
  )
}

export default FeedItem

export const ItemContainer = styled.div`
  padding: 10px;
  border-top: 1px solid ${borderColor};
  font-family: FKGrotesk;

  &:first-of-type {
    border-top: unset;
  }
`

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin-bottom: 10px;
`

export const Time = styled.div`
  font-weight: bold;
  font-size: 14px;
`

const ItemTitle = styled(Link)`
  display: flex;
  align-items: center;

  font-weight: bold;
  font-size: 14px;
  max-width: 80%;

  color: inherit;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  ::selection {
    background: #c7efe3;
  }
  ::-moz-selection {
    background: #c7efe3;
  }
`

export const ItemSubtitle = styled.div`
  font-weight: bold;
  font-size: 12px;

  color: #858585;

  ::selection {
    background: #c7efe3;
  }
  ::-moz-selection {
    background: #c7efe3;
  }
`

export const ItemDesc = styled.div`
  margin-top: 5px;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  color: #858585;
  white-space: pre-line;
  word-wrap: break-word;

  ::selection {
    background: #c7efe3;
  }
  ::-moz-selection {
    background: #c7efe3;
  }
`

export const ReadMore = styled.div`
  cursor: pointer;
  font-size: 12px;

  color: #51cd92;

  &:hover {
    opacity: 0.8;
  }
`

const UrlLink = styled.a`
  color: inherit;
  font-size: 12px;
  cursor: pointer;

  float: right;
  margin-left: auto;

  opacity: 0.5;
`

const BottomRow = styled.div`
  display: flex;
  margin-top: 10px;
`

export const SmallLogo = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 5px;
  border-radius: 24px;
`
