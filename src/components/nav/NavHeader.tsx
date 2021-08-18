import React from "react"
import styled from "styled-components"

import Search from "./Search"
import { SidebarItem } from "components/sidebar/Sidebar"
import { useAuth } from "context/AuthContext"
import ProfileIcon from "utils/profile.svg"
import { Link } from "react-router-dom"
import NavMobile from "./NavMobile"
import { backgroundColor, borderColor, textColor } from "context/theme"
import ColorToggle from "components/sidebar/ColorToggle"
import { useData } from "context/DataContext"

type Props = {
  projects: SidebarItem[]
  markets: SidebarItem[]
  metrics: SidebarItem[]
  isMobile: boolean
  isSidebarOpen: boolean
}

const NavAuth = () => {
  return (
    <NavAuthContainer>
      <LoginButton to="/login">Log in</LoginButton>
      <SignupButton to="/signup">Create account</SignupButton>
    </NavAuthContainer>
  )
}

const NavUser = () => {
  const { user } = useAuth()

  return (
    <Link to="/account">
      <ProfileContainer>
        <Username>{user.username || user.email}</Username>
        <ProfileImg src={ProfileIcon} alt="Profile" />
      </ProfileContainer>
    </Link>
  )
}

const NavHeader = (props: Props) => {
  const { isSidebarOpen } = props
  const { isLoggedIn, user } = useAuth()
  const { isMobile } = useData()

  if (isMobile) {
    return <NavMobile {...props} isLoggedIn={isLoggedIn} />
  }

  return (
    <Container>
      <Wrapper isSidebarOpen={isSidebarOpen}>
        <Navigator>
          <Search />
        </Navigator>
        <div style={{ display: "inline-flex", alignItems: "center" }}>
          <ColorToggle style={{ marginRight: "20px" }} isOpen />
          {!isLoggedIn && <NavAuth />}
          {isLoggedIn && !!user.id && <NavUser />}
        </div>
      </Wrapper>
    </Container>
  )
}

export default NavHeader

const Container = styled.div`
  width: 100%;
  height: 64px;
  align-items: center;
  position: fixed;
  background-color: ${backgroundColor};
  z-index: 10;
  border-bottom: 1px solid ${borderColor};
`

const Wrapper = styled.div<{ isSidebarOpen: boolean }>`
  box-sizing: content-box;
  height: 40px;
  display: flex;
  padding: 4px 32px 4px ${(props) => (props.isSidebarOpen ? "240px" : "58px")};
  align-items: center;
  height: 100%;
`

const Navigator = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`

const NavAuthContainer = styled.div`
  flex: 1;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: flex-end;
`

const ProfileContainer = styled.div`
  flex: 1;
  text-align: center;
  align-items: center;
  display: flex;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`
const ProfileImg = styled.img`
  margin-left: 8px;
  height: 28px;
`

const Username = styled.span`
  color: ${textColor};
  font-weight: 400;
`

const LoginButton = styled(Link)`
  border: 1px solid #00cf9d;
  width: 60px;
  height: 21px;
  font-size: 11px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #00cf9d;

  &:hover {
    opacity: 0.8;
  }
`

const SignupButton = styled(Link)`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;

  color: #ffffff;
  background: #00cf9d;

  box-sizing: border-box;
  height: 23px;
  font-size: 11px;
  line-height: 100%;

  margin-left: 4px;
  width: 135.85px;

  &:hover {
    opacity: 0.8;
  }
`
