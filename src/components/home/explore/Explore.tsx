import React from "react"
import styled from "styled-components"

const Explore = () => {
  return (
    <Container>
      <Title>
        {"Crypto redefines the way businesses are built and operated."} <br />
        {"Token Terminal gives you the tools to "}
        <Green>{"evaluate and track"}</Green>
        {" the most promising projects."}
      </Title>
    </Container>
  )
}

export default Explore

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 16px 32px;

  @media (max-width: 720px) {
    padding: 16px;
  }
`

const Title = styled.span`
  font-size: 32px;
  font-weight: 500;

  @media (max-width: 720px) {
    font-size: 19px;
  }
`

const Green = styled.span`
  color: #00cf9d;
`
