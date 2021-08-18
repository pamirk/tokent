import { useTheme } from "context/ThemeContext"
import styled from "styled-components"
import DarkModeIcon from "utils/moon.svg"
import Toggle from "components/generic/toggle/Toggle"
type Props = { isOpen: boolean; style?: any }
const ColorToggle = (props: Props) => {
  const { isOpen, style } = props
  const { mode, toggle } = useTheme()

  return (
    <Container style={style} isOpen={isOpen} title="Toggle theme">
      <Toggle onClick={toggle} checked={mode === "dark"} />
      <Img
        isOpen={isOpen}
        onClick={toggle}
        src={DarkModeIcon}
        alt="Dark mode"
      />
    </Container>
  )
}

export default ColorToggle

const Img = styled.img<{ isOpen: boolean }>`
  cursor: pointer;
  margin-bottom: ${(props) => (props.isOpen ? "unset" : "10px")};
  margin-left: 10px;
  width: 16px;
  height: 16px;
`

const Container = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: fit-content;
  max-width: ${(props) => (props.isOpen ? "100%" : "24px")};

  @media (max-width: 720px) {
    padding: 5px 0px 8px 16px;
  }
`
