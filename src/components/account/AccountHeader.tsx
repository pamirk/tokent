import React from "react"
import styled from "styled-components"
import Suitcase from "utils/suitcase.svg"
import { useAuth } from "context/AuthContext"
import { Redirect } from "react-router-dom"
import { AuthTitle, AuthImg } from "components/auth/AuthComponents"

const AccountHeader = () => {
  const { token, user } = useAuth()

  if (!token) {
    return <Redirect to="/login" />
  }
  return (
    <AuthTitle style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
      <UserInfo>
        <AuthImg src={Suitcase} alt="Account" />
        <span style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
          {user.username || user.email}
        </span>
      </UserInfo>
      <PaymentInfo
        style={{
          borderColor: user.paid ? "#9280FF" : "#00cf9d",
          color: user.paid ? "#9280FF" : "#00cf9d",
        }}
      >
        {user.subscriptionType === "trial"
          ? "PRO - trial"
          : user.subscriptionType === "paid"
          ? "PRO"
          : "Freemium"}
      </PaymentInfo>
    </AuthTitle>
  )
}

export default AccountHeader

const UserInfo = styled.div`
  display: flex;
  max-width: 100%;
`

const PaymentInfo = styled.div`
  font-size: 11px;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 128px;
  height: 22px;

  border: 2px solid #00cf9d;

  @media (max-width: 720px) {
    width: 80px;
  }
`
