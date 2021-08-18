import Button from "components/generic/button/Button"
import { borderColor, titleWrapperColor } from "context/theme"
import styled from "styled-components"

export const AuthContainer = styled.div`
  font-family: FKGrotesk-SemiMono;

  @media (max-width: 720px) {
    height: calc(100% - 67px);
  }
`

export const AuthTitle = styled.div`
  height: 79px;

  display: flex;
  align-items: center;

  font-size: 22px;
  line-height: 24px;

  border-bottom: 1px solid ${borderColor};
  padding: 0px 32px;

  background-color: ${titleWrapperColor};

  @media (max-width: 720px) {
    font-size: 14px;
    padding: 0px 16px;
  }
`

export const AuthWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 720px) {
    flex-direction: column-reverse;
  }
`

export const AuthSidebar = styled.div`
  font-size: 14px;
  line-height: 100%;

  flex: 1;

  border-left: 1px solid ${borderColor};
`

export const AuthContents = styled.div`
  padding: 40px 48px;
  border-bottom: 1px solid ${borderColor};

  flex: 2;
  @media (max-width: 720px) {
    padding: 16px 40px;
    width: calc(100% - 80px);
  }
`

export const AuthImg = styled.img`
  margin-right: 16px;
`

export const Title = styled.div`
  font-weight: bold;
  font-size: 32px;
  margin-bottom: 20px;
`

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`

export const ErrorMsg = styled.div`
  color: #eb5858;
  font-size: 13px;
  line-height: 24px;
`

export const AuthText = styled.div`
  font-size: 14px;
  line-height: 24px;
`

export const GreenButton = styled(Button)`
  height: 45px;
  width: 136px;
  min-width: fit-content;
  font-weight: 600;
  border: unset;
  cursor: pointer;
  color: white;
  background-color: #00cf9d;
  border-radius: 0px;
  margin-right: 20px;

  &:hover {
    opacity: 0.8;
  }
`

export const RedButton = styled(GreenButton)`
  background-color: #eb5858;
  margin: 0px;
  width: fit-content;

  @media (max-width: 720px) {
    line-height: unset;
  }
`
