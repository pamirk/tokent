import { backgroundColor } from "context/theme"
import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  body {
    background: ${backgroundColor};
  }
`

export default GlobalStyle
