import React, { useState } from "react"
import AccountSectionTitle from "components/account/AccountSectionTitle"
import styled from "styled-components"

const faq = [
  {
    question: "Can I cancel my PRO-subscription anytime?",
    answer:
      "Yes, you can cancel your subscription any time. You subscription will be valid until the end of the current billing cycle (end of month/ end of year) and will not renew. After canceling the subscription you will not be charged again unless you purchase a new subscription.",
  },
  {
    question: "How do I get the API key?",
    answer:
      "After upgrading to Token Terminal PRO, you will find your API key (+link to our API docs) on the right side of your account pages when logged in.",
  },
  {
    question: "Can I speak with someone from the team?",
    answer: "Yes, just shoot us an email at people@tokenterminal.xyz.",
  },
  {
    question: "How do I get an invoice for my subscriptions?",
    answer:
      "Just shoot us an email at people@tokenterminal.xyz and we’ll email your invoice.",
  },
  {
    question: "Where can I find the terms of service?",
    answer:
      "We make use of a standard set of general terms that apply to all of our users. https://docs.tokenterminal.com/terms",
  },
  {
    question: "Can I get access for my whole team?",
    answer:
      "Yes, we offer team-wide subscriptions. Please contact us at people@tokenterminal.xyz.",
  },
]
const FAQ = () => {
  const [isSectionOpen, setIsSectionOpen] = useState(true)

  return (
    <>
      <AccountSectionTitle
        title="Frequently asked questions"
        isOpen={isSectionOpen}
        toggleIsOpen={() => setIsSectionOpen(!isSectionOpen)}
      />
      <div style={{ padding: "40px 48px" }}>
        {isSectionOpen &&
          faq.map((entry) => (
            <FAQEntry
              key={entry.question}
              question={entry.question}
              answer={entry.answer}
            />
          ))}
      </div>
    </>
  )
}

type FAQEntryProps = { question: string; answer: string }

const FAQEntry = (props: FAQEntryProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { question, answer } = props

  return (
    <Container>
      <Question onClick={() => setIsOpen(!isOpen)}>
        {question} {isOpen ? <ArrowUp /> : <ArrowDown />}
      </Question>
      {isOpen && <Answer>{answer}</Answer>}
    </Container>
  )
}

export default FAQ

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-family: FKGrotesk-SemiMono;
  margin-bottom: 20px;
`

const Question = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 100%;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: space-between;

  &:hover {
    opacity: 0.7;
  }
`

const Answer = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  margin: 10px 0px;
`

const ArrowUp = () => (
  <Svg
    width="17"
    height="9"
    viewBox="0 0 17 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 8L8.5 1L1 8"
      stroke="#00CF9D"
      strokeWidth="2"
      strokeLinejoin="bevel"
    />
  </Svg>
)

const ArrowDown = () => (
  <Svg
    width="17"
    height="9"
    viewBox="0 0 17 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L8.5 8L16 1"
      stroke="#00CF9D"
      strokeWidth="2"
      strokeLinejoin="bevel"
    />
  </Svg>
)

const Svg = styled.svg`
  max-width: 17px;
  max-height: 9px;

  @media (max-width: 720px) {
    max-width: 10px;
    max-height: 9px;
  }
`
