import React, { useState } from "react"

import { signup } from "api/ApiCalls"
import Input from "components/generic/input/Input"
import { Link, Redirect } from "react-router-dom"
import HandIcon from "utils/hand.svg"
import styled from "styled-components"
import {
  AuthContainer,
  AuthContents,
  ButtonRow,
  ErrorMsg,
  AuthTitle,
  AuthWrapper,
  AuthImg,
  GreenButton,
  AuthSidebar,
  AuthText,
} from "./AuthComponents"
import { useAuth } from "context/AuthContext"
import PlansAndPricing from "./PlansAndPricing"
import FAQ from "./FAQ"

const Signup = () => {
  const { isLoggedIn } = useAuth()

  document.title = "Token Terminal | Sign up"

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConf, setPasswordConf] = useState("")
  const [isSubmitting, setIsSubmmitting] = useState(false)

  const [signUpFinished, setSignupFinished] = useState(false)
  const [error, setError] = useState("")
  const handleSignup = () => {
    setIsSubmmitting(true)
    signup(username, email, password)
      .then(() => setSignupFinished(true))
      .catch((ex) => setError(ex.message))
      .finally(() => setIsSubmmitting(false))
  }

  if (signUpFinished) {
    return <Redirect to="/login?signup=true" />
  }

  if (isLoggedIn) {
    return <Redirect to="/account" />
  }

  return (
    <AuthContainer>
      <AuthTitle>
        <AuthImg src={HandIcon} alt="Signup" />
        {"Create account (and start a 3-day trial)"}
      </AuthTitle>
      <AuthWrapper>
        <div style={{ flex: 2 }}>
          <AuthContents>
            <Input
              title="Username"
              type="text"
              value={username}
              submit={handleSignup}
              onChange={setUsername}
              required
            />
            <Input
              title="Email"
              type="text"
              value={email}
              submit={handleSignup}
              onChange={setEmail}
              required
            />
            <Input
              title="Password"
              type="password"
              value={password}
              submit={handleSignup}
              onChange={setPassword}
              required
            />
            <Input
              title="Repeat password"
              type="password"
              value={passwordConf}
              submit={handleSignup}
              onChange={setPasswordConf}
              required
            />
            {error !== "" && <ErrorMsg>{error}</ErrorMsg>}
            <ButtonRow>
              <GreenButton
                onClick={handleSignup}
                disabled={isSubmitting}
                name="Create account"
              />
              <AuthText style={{ color: "#858585", marginTop: "20px" }}>
                {"I already have an account. Log in "}
                <StyledLink to="/login">{"here"}</StyledLink>
                {"."}
              </AuthText>
            </ButtonRow>
          </AuthContents>
          <PlansAndPricing />
          <FAQ />
        </div>

        <StyledAuthSidebar>
          {
            <>
              <p>
                After creating your account you can choose to upgrade to the
                pro-version of Token Terminal.
              </p>
              <br />
              <p>
                Token Terminal Pro users can download the{" "}
                <span style={{ color: "#00CF9D" }}>
                  Token Terminal Master Excel
                </span>{" "}
                – all of our latest data in one single data sheet, as well as
                all tables and charts on our site.
              </p>
              <br />
              <p>We offer a free 3-day trial - enjoy!</p>
            </>
          }
        </StyledAuthSidebar>
      </AuthWrapper>
    </AuthContainer>
  )
}

export default Signup

const StyledLink = styled(Link)`
  text-decoration: underline;
  color: inherit;

  &:hover {
    opacity: 0.8;
  }
`

const StyledAuthSidebar = styled(AuthSidebar)`
  padding: 40px;
  width: calc(100% - 80px);

  @media (max-width: 720px) {
    padding: 0px 40px 80px;
  }
`
