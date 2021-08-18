import { useData } from "context/DataContext"
import { useTheme } from "context/ThemeContext"
import React from "react"

type Props = { x: number; y: number; payload: { value: string } }

const CustomAxisTick = (props: Props) => {
  const { projects, isMobile } = useData()

  const { x, y, payload } = props

  const project = projects?.find((p) => p.name === payload.value)

  if (project && !isMobile) {
    return (
      <a
        href={
          window.location.origin + "/terminal/projects/" + project?.project_id
        }
      >
        <TextSvg x={x} y={y}>
          {payload.value}
        </TextSvg>
      </a>
    )
  }

  return (
    <TextSvg x={x} y={y}>
      {payload.value}
    </TextSvg>
  )
}

type TextSvgProps = { x: number; y: number; children: React.ReactNode }

const TextSvg = (props: TextSvgProps) => {
  const { isMobile } = useData()
  const { mode } = useTheme()

  const { x, y, children } = props

  return (
    <text
      orientation="bottom"
      x={x}
      y={y}
      dy={7}
      textAnchor="end"
      fill={mode === "light" ? "unset" : "#FFF"}
      fontSize={isMobile ? 7 : 12}
      transform={`rotate(-45, ${x}, ${y})`}
    >
      {children}
    </text>
  )
}

export default CustomAxisTick
