import { subscribeToNewsLetter } from "api/ApiCalls"
import Button from "components/generic/button/Button"
import Input from "components/generic/input/Input"
import { useData } from "context/DataContext"
import { borderColor } from "context/theme"
import React, { useState } from "react"
import styled from "styled-components"

const footerItems = [
  { name: "Twitter", url: "https://twitter.com/tokenterminal" },
  { name: "Substack", url: "https://tokenterminal.substack.com/" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/token-terminal" },
  { name: "Contact", url: "mailto:aleksis@tokenterminal.xyz" },
]

const footerItems2 = [
  { name: "Pricing", url: "https://docs.tokenterminal.com/pricing" },
  { name: "API", url: "https://docs.tokenterminal.com/api" },
  { name: "Terms", url: "https://docs.tokenterminal.com/terms" },
  { name: "Docs", url: "https://docs.tokenterminal.com/" },
  { name: "Careers", url: "https://docs.tokenterminal.com/careers" },
]

type Props = { marginLeft: number; marginRight: number }

const Footer = (props: Props) => {
  const { marginLeft, marginRight } = props
  const { isMobile } = useData()
  const [email, setEmail] = useState("")
  const [postStatus, setPostStatus] = useState<string | undefined>(undefined)
  const subscribe = () => {
    if (!email.includes("@") || email.length === 0) return
    subscribeToNewsLetter(email)
      .then(() => {
        setPostStatus("success")
        setEmail("")
      })
      .catch(() => setPostStatus("fail"))
  }

  return (
    <FooterContainer
      style={{
        marginLeft: isMobile ? "0px" : marginLeft,
        marginRight: isMobile ? "0px" : marginRight,
      }}
    >
      <div>
        <Title>{"Stay in the loop"}</Title>
        <Details>{"Join our mailing list to get the latest insights!"}</Details>
        {postStatus === "success" && (
          <Details>{"Thanks for subscribing!"}</Details>
        )}
        {postStatus === "fail" && <Details>{"Failed to subscribe."}</Details>}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px 0px 0px 20px",
          }}
        >
          <Input
            placeholder="Your email address"
            required
            onChange={setEmail}
            value={email}
          />
          <SignUpButton
            onClick={subscribe}
            disabled={email.length === 0 || !email.includes("@")}
            name="Sign up"
          />
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <Wrapper>
          {footerItems.map((item) => (
            <Item key={item.name} href={item.url} target="_blank">
              {item.name}
            </Item>
          ))}
        </Wrapper>
        <Wrapper>
          {footerItems2.map((item) => (
            <Item key={item.name} href={item.url} target="_blank">
              {item.name}
            </Item>
          ))}
        </Wrapper>
      </div>
    </FooterContainer>
  )
}

export default Footer

const Title = styled.div`
  font-family: FKGrotesk-SemiMono;
  font-weight: bold;
`

const Details = styled.div`
  font-family: FKGrotesk-SemiMono;
  margin-top: 10px;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-left: 70px;
  @media (max-width: 720px) {
    margin: 20px 20px 0px 10px;
  }
`
const FooterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 50px 32px;
  margin-bottom: 150px;
  border-top: 1px solid ${borderColor};
`

const Item = styled.a`
  line-height: 20px;
  font-size: 14px;
  color: inherit;
  margin-bottom: 10px;

  font-family: FKGrotesk-SemiMono;

  &:hover {
    opacity: 0.6;
  }
`

export const SignUpButton = styled(Button)`
  font-weight: 600;
  border: unset;
  cursor: pointer;
  color: white;
  background-color: #00cf9d;
  border-radius: 0px;
  margin-left: 20px;
  min-width: fit-content;

  &:hover {
    opacity: 0.8;
  }
`
