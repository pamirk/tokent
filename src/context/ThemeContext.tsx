import React from "react"
import styled, { ThemeProvider } from "styled-components"
import { backgroundColor, textColor } from "./theme"

const defaultMode = "light"

const ThemeToggleContext = React.createContext({
  mode: defaultMode,
  toggle: () => {},
  setTheme: (value: string) => {},
})

export const useTheme = () => React.useContext(ThemeToggleContext)

export const CustomThemeProvider = ({ children }: any) => {
  const [themeState, setThemeState] = React.useState({
    mode: defaultMode,
  })

  const toggle = () => {
    const mode = themeState.mode === "light" ? `dark` : `light`

    localStorage.setItem("mode", mode)
    setThemeState({ mode })
  }

  const setTheme = (theme: string) => {
    setThemeState({ mode: theme })
  }

  return (
    <ThemeToggleContext.Provider
      value={{ toggle: toggle, mode: themeState.mode, setTheme }}
    >
      <ThemeProvider
        theme={{
          mode: themeState.mode,
        }}
      >
        <Wrapper>{children}</Wrapper>
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  )
}

const Wrapper = styled.div`
  background-color: ${backgroundColor};
  color: ${textColor};
  margin-bottom: -50px;
`

export default ThemeProvider
