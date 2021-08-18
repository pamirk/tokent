import React from "react"
import styled from "styled-components"

type Props = {
  onResize: (width: number) => void
  refComponent: any
  children: React.ReactNode
  disabled?: boolean
  maxWidth?: number
  minWidth?: number
  style?: any
}

let isResizing = false

const Resize = (props: Props) => {
  const {
    style,
    refComponent,
    disabled,
    children,
    onResize,
    maxWidth,
    minWidth,
  } = props

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) {
      return
    }
    e.stopPropagation()
    e.preventDefault()

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    isResizing = true
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing && !disabled) {
      const offsetRight =
        document.body.offsetWidth - (e.clientX - document.body.offsetLeft)

      let newWidth = offsetRight

      if (minWidth && offsetRight <= minWidth) {
        newWidth = minWidth
      } else if (maxWidth && offsetRight >= maxWidth) {
        newWidth = maxWidth
      }

      refComponent.current.style.width = newWidth + "px"

      if (!!onResize) {
        onResize(newWidth)
      }
    }
  }

  const handleMouseUp = () => {
    if (isResizing) {
      isResizing = false
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }
  return (
    <Container style={style} onMouseDown={handleMouseDown}>
      {children}
    </Container>
  )
}

Resize.defaultProps = { disabled: false }

export default Resize

const Container = styled.div`
  &:hover {
    opacity: 0.8;
  }
`
