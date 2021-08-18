import {
  borderColor,
  defaultButtonColor,
  defaultButtonTextColor,
} from "context/theme"
import React from "react"
import styled from "styled-components"
import Tooltip from "../tooltip/Tooltip"

type Props = {
  url?: string
  name: string
  disabled: boolean
  backgroundColor?: string
  color?: string
  borderRadius?: string
  margin?: string | number
  onClick?: () => void
  className?: string
  icon?: string
  tooltipId?: string
  projectId?: string
  style?: any
}

const Button = (props: Props) => {
  const {
    className,
    disabled,
    name,
    url,
    backgroundColor,
    color,
    borderRadius,
    margin,
    icon,
    tooltipId,
    projectId,
    onClick,
    style,
  } = props

  if (url) {
    return (
      <ButtonLink href={url}>
        <Container
          className={className}
          disabled={disabled}
          style={{ ...style, backgroundColor, color, borderRadius, margin }}
        >
          <Tooltip id={tooltipId} projectId={projectId}>
            <Wrapper>
              {icon && <Img src={icon} alt={name} />}
              {name}
            </Wrapper>
          </Tooltip>
        </Container>
      </ButtonLink>
    )
  }

  return (
    <Container
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={{ ...style, backgroundColor, color, borderRadius, margin }}
    >
      <Tooltip id={tooltipId}>
        <Wrapper>
          {icon && <Img src={icon} alt={name} />}
          {name}
        </Wrapper>
      </Tooltip>
    </Container>
  )
}

const defaultProps: Props = {
  name: "",
  disabled: false,
}

Button.defaultProps = defaultProps

export default Button

const ButtonLink = styled.a`
  text-decoration: none;
`

const Img = styled.img`
  height: 11px;
  width: 11px;
  margin-right: 4px;
`

const Container = styled.div<{ disabled: boolean }>`
  font-size: 13px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border: 1px solid ${borderColor};
  color: ${defaultButtonTextColor};
  align-items: center;
  display: inline-flex;
  justify-content: center;

  text-decoration: none;
  padding: 0px 24px;
  width: max-content;
  outline: none;
  background-color: ${defaultButtonColor};

  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "unset")};
`

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
`
