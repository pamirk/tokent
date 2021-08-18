import Square from "components/generic/icons/Square"
import { useData } from "context/DataContext"
import { getLabelForTooltip } from "helpers/numerals"
import { sortBy } from "lodash"
import { TooltipProps } from "recharts"
import { ProjectType } from "types/ApiTypes"
import { getByLabel, getPercent } from "../ChartUtils"
import {
  Container,
  Contents,
  ContentsTitle,
  Item,
  Label,
  Title,
  Value,
  Wrapper,
} from "./TooltipComponents"

const CustomTooltip = ({
  active,
  payload,
  label,
  project,
  metric,
  isPercentageShareOn,
}: TooltipProps<any, any> & {
  project?: ProjectType
  metric?: string
  isPercentageShareOn?: boolean
}) => {
  const { isMobile } = useData()

  if (isMobile) return null

  const sortedPayload =
    metric === "ps"
      ? sortBy(Array.from(payload || []), "value")
      : sortBy(Array.from(payload || []), "value").reverse()
  const wrapData = sortedPayload.length > 3

  const title = payload && payload[0] ? payload[0].payload.tooltipLabel : label

  const total = isPercentageShareOn
    ? sortedPayload.reduce((result, entry) => result + entry.value, 0)
    : 0

  if (active) {
    return (
      <Container>
        <Wrapper>
          {title && <Title>{title}</Title>}
          <Contents style={{ flexFlow: wrapData ? "wrap" : "column" }}>
            {sortedPayload.map((entry: any, index: number) => (
              <Item
                key={entry.name + index}
                style={{ minWidth: wrapData ? "150px" : "fit-content" }}
              >
                <ContentsTitle>
                  <Square fill={entry.stroke || entry.fill} size="10" />
                  <Label>{getByLabel(entry.name, project)}</Label>
                </ContentsTitle>
                {isPercentageShareOn && (
                  <Value key="percentage">
                    {getPercent(entry.value, total)}
                  </Value>
                )}
                {getLabelForTooltip(entry.value, metric || entry.name).map(
                  (str) => (
                    <Value key={str}>{str}</Value>
                  )
                )}
              </Item>
            ))}
          </Contents>
        </Wrapper>
      </Container>
    )
  }

  return null
}

export default CustomTooltip
