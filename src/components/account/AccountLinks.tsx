import { logoutGet } from "api/ApiCalls"
import { useAuth } from "context/AuthContext"
import { borderColor } from "context/theme"
import React from "react"
import { Link, Redirect } from "react-router-dom"
import styled from "styled-components"

const AccountLinks = () => {
  const { token, logout } = useAuth()

  const handleLogout = () => {
    logoutGet().catch(() => {})
    logout()
  }

  if (!token) {
    return <Redirect to="/login" />
  }

  return (
    <Links>
      <LinkText onClick={handleLogout}>{"Log out"} </LinkText>
      <StyledLink to="/settings">{"Edit account"} </StyledLink>
    </Links>
  )
}

export default AccountLinks

const Links = styled.div`
  display: flex;
  font-family: FKGrotesk-SemiMono;
  font-size: 14px;
  border-bottom: 1px solid ${borderColor};
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-end;
  padding: 16px 40px;

  height: calc(100px - 53px);

  @media (max-width: 720px) {
    align-items: flex-start;
  }
`

const LinkText = styled.span`
  margin-bottom: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`

const StyledLink = styled(Link)`
  color: inherit;
  &:hover {
    opacity: 0.8;
  }
`
