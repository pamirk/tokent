import React, { useState } from "react"
import styled from "styled-components"
import { Redirect, useParams } from "react-router-dom"
import { resetPassword } from "api/ApiCalls"
import Input from "components/generic/input/Input"
import {
  AuthContainer,
  AuthWrapper,
  ErrorMsg,
  GreenButton,
} from "components/auth/AuthComponents"
import AccountSectionTitle from "components/account/AccountSectionTitle"
import HandIcon from "utils/hand.svg"

interface RouteParams {
  token: string
}

const ResetPassword = () => {
  document.title = "Token Terminal | Reset password"

  const [newPw, setNewPw] = useState("")
  const [confirmNewPw, setConfirmNewPw] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [pwChangeStatus, setPwChangeStatus] = useState({
    error: false,
    success: false,
  })

  const { token } = useParams<RouteParams>()

  const handleChangePassword = () => {
    if (!token) return
    setPwChangeStatus({ error: false, success: false })
    setIsSubmitting(true)
    resetPassword({ password: newPw, token })
      .then(() => setPwChangeStatus({ error: false, success: true }))
      .catch(() => setPwChangeStatus({ error: true, success: false }))
      .finally(() => setIsSubmitting(false))
  }

  if (!token) {
    return <Redirect to="/login" />
  }

  if (pwChangeStatus.success) {
    return <Redirect to="/login" />
  }

  return (
    <AuthContainer>
      <AuthWrapper>
        <Contents>
          <div>
            <AccountSectionTitle
              title="Set new password"
              isOpen={true}
              canToggle={false}
              img={HandIcon}
            />

            <SectionContents>
              <Input
                title="New password"
                onChange={setNewPw}
                value={newPw}
                type="password"
                required
              />
              <Input
                title="Repeat new password"
                onChange={setConfirmNewPw}
                value={confirmNewPw}
                type="password"
                required
              />
              {pwChangeStatus.error && (
                <ErrorMsg>{"Pasword change failed"}</ErrorMsg>
              )}
              <GreenButton
                onClick={handleChangePassword}
                name="Change password"
                disabled={
                  isSubmitting || newPw !== confirmNewPw || newPw.length < 8
                }
              />
            </SectionContents>
          </div>
        </Contents>
      </AuthWrapper>
    </AuthContainer>
  )
}

export default ResetPassword

const SectionContents = styled.div`
  padding: 24px 48px 32px;

  @media (max-width: 720px) {
    padding: 24px 40px;
  }
`

const Contents = styled.div`
  flex: 2;
`
