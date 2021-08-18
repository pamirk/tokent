import React, { useState } from "react"
import { loginPost, resetPassword, resendEmailVerification } from "api/ApiCalls"
import Input from "components/generic/input/Input"
import { useAuth } from "context/AuthContext"
import { Redirect } from "react-router"
import HandIcon from "utils/hand.svg"
import styled from "styled-components"
import {
  AuthContainer,
  AuthTitle,
  ButtonRow,
  ErrorMsg,
  AuthImg,
  AuthContents,
  AuthSidebar,
  AuthWrapper,
  AuthText,
  GreenButton,
} from "./AuthComponents"
import { Link } from "react-router-dom"
import { getParameterByName } from "helpers/querystring"
import Modal from "components/generic/modal/Modal"
import {
  ModalContents,
  ModalTitle,
} from "components/generic/modal/ModalComponents"

const Login = () => {
  const status = getParameterByName("signup")

  document.title = "Token Terminal | Login"

  const { isLoggedIn, user, login } = useAuth()
  const [showModal, setShowModal] = useState(status === "true")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmmitting] = useState(false)
  const [error, setError] = useState("")
  const [isForgotPWModalOpen, setIsForgotPWModalOpen] = useState(false)
  const [pwChangeEmail, setPWChangeEmail] = useState("")
  const [isPWResetEmailSent, setIsPWResetEmailSent] = useState(false)

  const handleLogin = () => {
    setIsSubmmitting(true)
    loginPost(username, password)
      .then((res) => login(res.token))
      .catch((ex) => setError(ex.message))
      .finally(() => setIsSubmmitting(false))
  }

  const handleResetPassword = () => {
    resetPassword({ email: pwChangeEmail }).then(() =>
      setIsPWResetEmailSent(true)
    )
  }

  const sendVerifyEmail = () => {
    resendEmailVerification(username)
      .then(() => {
        setShowModal(true)
        setError("")
      })
      .catch(() => setError("Failed to send email verification."))
  }

  if (isLoggedIn && !!user.id) {
    return <Redirect to="/account" />
  }

  return (
    <AuthContainer>
      <AuthTitle>
        <AuthImg src={HandIcon} alt="Log in" />
        {"Log in"}
      </AuthTitle>
      <AuthWrapper>
        <AuthContents style={{ borderBottom: "unset" }}>
          <Input
            title="Email"
            type="text"
            value={username}
            submit={handleLogin}
            onChange={setUsername}
            required
          />
          <Input
            title="Password"
            type="password"
            value={password}
            submit={handleLogin}
            onChange={setPassword}
            required
          />
          {error !== "" && error !== "Please verify your email" && (
            <ErrorMsg>{error}</ErrorMsg>
          )}
          {error === "Please verify your email" && (
            <ErrorMsg onClick={sendVerifyEmail}>
              {"Email is not verified, click "}
              <span style={{ cursor: "pointer", textDecoration: "underline" }}>
                {"here"}
              </span>
              {" to resend the verification email"}
            </ErrorMsg>
          )}
          <ButtonRow>
            <GreenButton
              onClick={handleLogin}
              disabled={isSubmitting}
              name="Log in"
            />
          </ButtonRow>
          <AuthText>
            {"Don’t have an account yet? Create one "}
            <StyledLink to="/signup">{"here"}</StyledLink>
            {"."}

            <ForgotPW onClick={() => setIsForgotPWModalOpen(true)}>
              {"Forgot password?"}
            </ForgotPW>
          </AuthText>
        </AuthContents>
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
            </>
          }
        </StyledAuthSidebar>
      </AuthWrapper>
      <Modal
        show={isForgotPWModalOpen}
        title="Forgot pasword?"
        onClose={() => setIsForgotPWModalOpen(false)}
      >
        {isPWResetEmailSent && (
          <>
            {"We just sent you a "}
            <span style={{ color: "#E95626" }}>{"password reset link"}</span>
            {
              ". Click the reset password link in your email to set a new password."
            }
          </>
        )}
        {!isPWResetEmailSent && (
          <ForgotPWWrapper>
            <Input
              title="Email"
              type="text"
              value={pwChangeEmail}
              onChange={setPWChangeEmail}
              required
            />
            <ResetPWButton
              name="Reset password"
              onClick={handleResetPassword}
              disabled={
                isSubmitting ||
                pwChangeEmail.length === 0 ||
                !pwChangeEmail.includes("@")
              }
            />
          </ForgotPWWrapper>
        )}
      </Modal>

      <Modal
        style={{ padding: "0px" }}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <ModalTitle>{"Verify email"}</ModalTitle>
        <ModalContents>
          {"We just sent you a "}
          <span style={{ color: "#E95626" }}>{"verification email"}</span>
          {
            ". Open your email, verify the email by clicking on “verify email” and proceed to log in."
          }
        </ModalContents>
      </Modal>
    </AuthContainer>
  )
}

export default Login

const ResetPWButton = styled(GreenButton)`
  margin-bottom: 16px;
  margin-right: 0px;
`
const ForgotPW = styled.div`
  color: inherit;

  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`

const ForgotPWWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;

  @media (max-width: 720px) {
    justify-content: center;
  }
`

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
