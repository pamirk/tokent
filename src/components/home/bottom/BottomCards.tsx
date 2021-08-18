import React from "react"
import styled from "styled-components"
import Card from "components/generic/card/Card"
import { borderColor } from "context/theme"
type CardType = {
  title: string
  text: string
  urlText: string
  url?: string
  email?: string
}
let cards: CardType[] = [
  {
    title: "Additional information",
    text: "Read more about our mission and methodology, pricing, API etc.",
    urlText: "About Token Terminal",
    url: "https://docs.tokenterminal.com/",
  },
  {
    title: "Contact us",
    text: "For general inquries, data requests, partnerships, feedback, etc.",
    urlText: "Contact",
    email: "mailto:aleksis@tokenterminal.xyz",
  },
]

const BottomCards = () => {
  return (
    <Container>
      {cards.map((item) => (
        <Card
          key={item.text}
          style={{ flex: 1 }}
          title={item.title}
          text={item.text}
          url={item.url}
          email={item.email}
          urlText={item.urlText}
        />
      ))}
    </Container>
  )
}

export default BottomCards

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;

  border-top: 1px solid ${borderColor};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`
