import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import AuthProvider from "context/AuthContext"
import DataProvider from "context/DataContext"
import { CustomThemeProvider } from "context/ThemeContext"
import GlobalStyle from "styles/globalStyle"

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <CustomThemeProvider>
          <GlobalStyle />
          <App />
        </CustomThemeProvider>
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
