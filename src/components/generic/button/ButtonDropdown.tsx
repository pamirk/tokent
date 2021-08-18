import useOnClickOutside from "helpers/hooks/useOnClickOutside"
import React, { useState, useRef } from "react"
import styled from "styled-components"
import ArrowDown from "utils/arrowDownWhite.svg"
import ArrowUp from "utils/arrowUpWhite.svg"
import Tooltip from "../tooltip/Tooltip"

type Props = {
  onOptionSelect: (option: OptionType) => void
  options: OptionType[]
  selected?: string
  disabled?: boolean
  placeholder?: string
  tooltipId?: string
  projectId?: string
  style?: any
}

type OptionType = { name: string; label: string; disabled?: boolean }

const ButtonDropdown = (props: Props) => {
  const {
    onOptionSelect,
    options,
    selected,
    placeholder,
    disabled,
    tooltipId,
    projectId,
    style,
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  const handleOptionClick = (option: OptionType) => {
    onOptionSelect(option)
  }

  const handleClickOutside = () => setIsOpen(false)

  useOnClickOutside(ref, handleClickOutside)

  return (
    <Container
      onClick={() => (disabled ? {} : setIsOpen(!isOpen))}
      disabled={disabled}
      style={style}
    >
      <div ref={ref}>
        <Tooltip id={tooltipId} projectId={projectId}>
          <Selected>
            <div>{selected || placeholder || "Select.."}</div>
            <Arrow src={isOpen ? ArrowUp : ArrowDown} alt="Toggle" />
          </Selected>
        </Tooltip>
        {isOpen && (
          <OptionsList>
            {options
              .filter((option) => option.label !== selected)
              .map((option) => (
                <Option
                  disabled={option.disabled}
                  key={option.label}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </Option>
              ))}
          </OptionsList>
        )}
      </div>
    </Container>
  )
}

export default ButtonDropdown

const Selected = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`
const Arrow = styled.img`
  margin: 0px 4px;
`
const Container = styled.div<{
  disabled?: boolean
}>`
  display: block;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  width: 138px;

  pointer-events: ${(props) => (props.disabled ? "none" : "")};
  background: #2a2a2a;

  border: 1px solid;
  box-sizing: border-box;

  font-family: FKGrotesk-SemiMono;
  font-size: 10px;
  line-height: 100%;

  cursor: ${(props) => (props.disabled ? "default" : "pointer")};

  color: #ffffff;

  margin: 0px 8px 8px 0px;

  &:last-of-type {
    height: fit-content;
  }
`

const OptionsList = styled.div`
  display: flex;
  width: 136px;
  flex-direction: column;

  font-family: FKGrotesk-SemiMono;
  font-size: 10px;

  position: absolute;
  background: #2a2a2a;
  color: #ffffff;
  margin-top: 8px;
  margin-left: -9px;
  z-index: 100;
  max-height: 240px;
  overflow: auto;

  border: 1px solid;
  border-top: unset;
`

const Option = styled.div<{ disabled?: boolean }>`
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  pointer-events: ${(props) => (props.disabled ? "none" : "default")};
  cursor: pointer;
  padding: 8px;
  align-items: center;
  display: inline-flex;
  justify-content: flex-start;

  &:hover {
    background-color: #cecece;
  }
`
