import React, { useState } from "react"
import styled from "styled-components"
import { useAuth } from "context/AuthContext"
import { Redirect } from "react-router-dom"
import { changePassword, postPortal, postUnsubscribe } from "api/ApiCalls"
import AccountHeader from "./AccountHeader"
import Input from "components/generic/input/Input"
import {
  AuthContainer,
  AuthSidebar,
  AuthWrapper,
  ErrorMsg,
  GreenButton,
  RedButton,
} from "components/auth/AuthComponents"
import AccountSectionTitle from "./AccountSectionTitle"
import Modal from "components/generic/modal/Modal"
import Button from "components/generic/button/Button"
import AuthSidebarContents from "./AuthSidebarContents"

const Settings = () => {
  document.title = "Token Terminal | Settings"

  const { user, token } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmNewPw, setConfirmNewPw] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isNameSectionOpen, setIsNameSectionOpen] = useState(true)
  const [isPWSectionOpen, setIsPWSectionOpen] = useState(true)
  const [isSubscriptionSectionOpen, setIsSubscriptionSectionOpen] = useState(
    true
  )

  const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false)

  const [pwChangeStatus, setPwChangeStatus] = useState({
    error: false,
    success: false,
  })

  const [unsubscribeSuccess, setUnsubscribeSuccess] = useState(true)
  const handleEditUser = () => {
    // TODO
  }

  const handleChangePassword = () => {
    setPwChangeStatus({ error: false, success: false })
    setIsSubmitting(true)
    changePassword(currentPw, newPw)
      .then(() => {
        setPwChangeStatus({ error: false, success: true })
        setNewPw("")
        setCurrentPw("")
        setConfirmNewPw("")
      })
      .catch(() => setPwChangeStatus({ error: true, success: false }))
      .finally(() => setIsSubmitting(false))
  }

  const handleUnsubscribe = () => {
    if (!user.id) return
    setUnsubscribeSuccess(true)
    setIsSubmitting(true)
    postUnsubscribe(user.id)
      .then(() => setIsUnsubscribeModalOpen(false))
      .catch(() => setUnsubscribeSuccess(false))
  }

  const handleManageSubscription = () => {
    postPortal()
      .then((res) => (window.location.href = res.url))
      .catch(() => {})
  }

  if (!token) {
    return <Redirect to="/login" />
  }

  return (
    <AuthContainer>
      <AccountHeader />
      <AuthWrapper>
        <Contents>
          {false && (
            <>
              <AccountSectionTitle
                title="Username and email"
                isOpen={isNameSectionOpen}
                toggleIsOpen={() => setIsNameSectionOpen(!isNameSectionOpen)}
              />
              {isNameSectionOpen && (
                <SectionContents>
                  <Input
                    title="Username"
                    onChange={setName}
                    value={name}
                    required
                  />
                  <Input
                    title="Email"
                    onChange={setEmail}
                    value={email}
                    required
                  />
                  <GreenButton
                    onClick={handleEditUser}
                    disabled={isSubmitting}
                    name="Save"
                  />
                </SectionContents>
              )}
            </>
          )}
          <AccountSectionTitle
            title="Password"
            isOpen={isPWSectionOpen}
            toggleIsOpen={() => setIsPWSectionOpen(!isPWSectionOpen)}
          />

          {isPWSectionOpen && (
            <SectionContents>
              <Input
                title="Current password"
                onChange={setCurrentPw}
                value={currentPw}
                type="password"
                required
              />
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
                <ErrorMsg>{"Password change failed"}</ErrorMsg>
              )}
              {pwChangeStatus.success && (
                <SuccessMsg>{"Password changed"}</SuccessMsg>
              )}

              <GreenButton
                onClick={handleChangePassword}
                name="Change password"
                disabled={
                  isSubmitting || newPw !== confirmNewPw || newPw.length < 8
                }
              />
            </SectionContents>
          )}
          {user.paid && !user.subscription.cancelAtPeriodEnd && (
            <>
              <AccountSectionTitle
                title="Subscription"
                isOpen={isSubscriptionSectionOpen}
                toggleIsOpen={() =>
                  setIsSubscriptionSectionOpen(!isSubscriptionSectionOpen)
                }
              />
              {isSubscriptionSectionOpen && (
                <SectionContents
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <RedButton
                    onClick={() => setIsUnsubscribeModalOpen(true)}
                    name="Unsubscribe from Pro"
                  />
                  <GreenButton
                    margin="10px 0px"
                    onClick={handleManageSubscription}
                    name="Manage payment details"
                  />
                </SectionContents>
              )}
              <Modal
                title="Unsubscribe from Token Terminal Pro"
                show={isUnsubscribeModalOpen}
                onClose={() => setIsUnsubscribeModalOpen(false)}
                errorMsg={
                  !unsubscribeSuccess ? "Failed to unsubcribe." : undefined
                }
              >
                <span>
                  {
                    "We are sorry to see you go. Let us know what we can do better."
                  }
                </span>
                <UnSubscribeButtonWrapper>
                  <ModalButton
                    color="#00cf9d"
                    url="mailto:aleksis@tokenterminal.xyz"
                    name="Contact team"
                  />
                  <ModalButton
                    color="#EB5858"
                    onClick={handleUnsubscribe}
                    name="Unsubscribe"
                  />
                </UnSubscribeButtonWrapper>
              </Modal>
            </>
          )}
        </Contents>
        <AuthSidebar>
          <AuthSidebarContents />
        </AuthSidebar>
      </AuthWrapper>
    </AuthContainer>
  )
}

export default Settings

const SectionContents = styled.div`
  padding: 24px 48px 32px;

  @media (max-width: 720px) {
    padding: 24px 40px;
  }
`

const Contents = styled.div`
  flex: 2;
  width: 100%;
`

const UnSubscribeButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`

const ModalButton = styled(Button)<{ color: string }>`
  font-size: 11px;

  width: 128px;
  height: 22px;

  border: 1px solid ${(props) => props.color};
  color: ${(props) => props.color};
  cursor: pointer;
  margin-left: 8px;

  border-radius: unset;

  &:hover {
    opacity: 0.7;
  }
`

const SuccessMsg = styled.div`
  margin-bottom: 10px;
`
