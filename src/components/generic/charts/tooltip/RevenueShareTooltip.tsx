import { useData } from "context/DataContext"
import { getLabelForTooltip } from "helpers/numerals"
import { sortBy } from "lodash"
import { TooltipProps } from "recharts"
import Square from "../../icons/Square"
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

const RevenueShareTooltip = ({
  active,
  payload,
  label,
  isPercentageShareOn,
}: TooltipProps<any, any> & {
  isPercentageShareOn?: boolean
}) => {
  const { isMobile } = useData()
  if (isMobile) return null

  const sortedPayload: any = sortBy(
    Array.from(payload || []),
    "value"
  ).reverse()
  let totalRevenue = 0
  payload?.forEach((element) => (totalRevenue += element.value))
  const finalPayload = [
    {
      name: "Total revenue",
      value: totalRevenue,
      tooltipLabel: "Total revenue",
      stroke: "white",
    },
  ].concat(sortedPayload)

  const total = isPercentageShareOn
    ? sortedPayload.reduce((result: any, entry: any) => result + entry.value, 0)
    : 0

  if (active) {
    return (
      <Container>
        <Wrapper>
          <Title>
            {payload && payload[0] ? payload[0].payload.tooltipLabel : label}
          </Title>
          <Contents style={{ flexFlow: "column" }}>
            {finalPayload.map((entry: any) => (
              <Item key={entry.name} style={{ minWidth: "fit-content" }}>
                <ContentsTitle>
                  <Square fill={entry.fill} size="10" />
                  <Label>{getByLabel(entry.name)}</Label>
                </ContentsTitle>
                {isPercentageShareOn && (
                  <Value key="percentage">
                    {getPercent(entry.value, total)}
                  </Value>
                )}
                {getLabelForTooltip(entry.value, entry.name).map((str) => (
                  <Value key={str}>{str}</Value>
                ))}
              </Item>
            ))}
          </Contents>
        </Wrapper>
      </Container>
    )
  }

  return null
}

export default RevenueShareTooltip
