import React, { useState } from "react"
// import { buyNow } from "api/ApiCalls"
// import { useStripe } from "@stripe/react-stripe-js"
import Checkmark from "components/generic/icons/Checkmark"
import styled from "styled-components"
import { GreenButton } from "components/auth/AuthComponents"
import AccountSectionTitle from "./AccountSectionTitle"

const details = [
  "Download all charts & tables in Excel.",
  "Token Terminal API access.",
  "Download Token Terminal Master Excel",
  "Create own tables and charts [soon].",
]

const BuyNow = () => {
  // const stripe = useStripe()

  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [isYearly, setIsYearly] = useState<boolean>(true)
  const price = isYearly ? "€3250" : "€325"
  const detailText = isYearly ? "Year / per user" : "Month / per user"
  // const priceId = isYearly ? "price_1IoNCFENIA9dlSUdeBfiye7C" : "price_1IH2L5ENIA9dlSUdo8XuiFXO"

  const handleBuyNow = () => {
    // if (!stripe) return
    //
    // buyNow(priceId).then((res) =>
    //   stripe.redirectToCheckout({
    //     sessionId: res.sessionId,
    //   })
    // )
  }

  return (
    <>
      <AccountSectionTitle
        title="Token Terminal Pro (Early bird)."
        isOpen={isOpen}
        toggleIsOpen={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <Contents>
          <HeaderRow>
            <HeaderItem isSelected={isYearly} onClick={() => setIsYearly(true)}>
              {"Yearly"}
            </HeaderItem>
            <HeaderItem
              isSelected={!isYearly}
              onClick={() => setIsYearly(false)}
            >
              {"Monthly"}
            </HeaderItem>
          </HeaderRow>
          <PriceRow>
            <Price>{price}</Price>
            <VAT>{"+VAT"}</VAT>
          </PriceRow>
          <Details>{detailText}</Details>

          <DetailsContainer>
            {details.map((detail, i) => (
              <Detail key={detail}>
                <Checkmark stroke={i === 3 ? "#C4C4C4" : undefined} />
                <DetailText>{detail}</DetailText>
              </Detail>
            ))}
          </DetailsContainer>
          <GreenButton onClick={handleBuyNow} name="Buy" />
        </Contents>
      )}
    </>
  )
}

export default BuyNow

const Contents = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 40px;
`

const DetailsContainer = styled.div`
  max-width: 280px;
  margin-bottom: 40px;
`
const Detail = styled.div`
  margin-top: 8px;
  align-items: center;
  display: flex;
  justify-content: flex-start;

  &:last-child {
    opacity: 0.4;
  }
`

const DetailText = styled.span`
  margin-left: 8px;
  font-size: 11px;
  line-height: 100%;
  max-width: calc(100% - 40px);
  display: flex;
  align-items: center;
`

const HeaderRow = styled.div`
  display: inline-flex;
  margin-bottom: 40px;
`

const PriceRow = styled.div`
  font-size: 22px;
  line-height: 24px;
  display: inline-flex;
  /* identical to box height, or 86% */

  text-align: right;

  color: #00cf9d;
`

const Price = styled.div``
const VAT = styled.div`
  margin-top: 4px;
  font-size: 13px;
`

const Details = styled.div`
  font-size: 11px;
  height: 14px;
  display: flex;
  margin-bottom: 24px;

  align-items: center;
`

const HeaderItem = styled.div<{ isSelected: boolean }>`
  font-size: 9px;
  line-height: 100%;
  margin-right: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 64px;
  height: 22px;

  border: 2px solid ${(props) => (props.isSelected ? "#00cf9d" : "#BFBFBF")};
  color: ${(props) => (props.isSelected ? "#00cf9d" : "#BFBFBF")};
`
