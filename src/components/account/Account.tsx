import React, { useState } from "react"
import styled from "styled-components"
import BuyNow from "./BuyNow"
import { useAuth } from "context/AuthContext"
import { Redirect } from "react-router-dom"

// import { Elements } from "@stripe/react-stripe-js"
// import { loadStripe } from "@stripe/stripe-js"
import { getParameterByName } from "helpers/querystring"
import {
  AuthContainer,
  AuthWrapper,
  AuthSidebar,
} from "components/auth/AuthComponents"
import AccountHeader from "./AccountHeader"
import {
  ModalContents,
  ModalTitle,
} from "components/generic/modal/ModalComponents"
import Modal from "components/generic/modal/Modal"
import DownloadAll from "./DownloadAll"
import AuthSidebarContents from "./AuthSidebarContents"
import Favorites from "./favorites/Favorites"
import ToCustomChart from "./ToCustomChart"
/*const stripePromise = loadStripe(
  "pk_live_51Hj3MjENIA9dlSUdxEef1IZMAauFVaOvFYAmv95OxMSlqouICRrMNIsxnXvUeLcnMN8wsWrve7jBP8DNF8rYEEk1000rl0wn2Q"
)*/

const Account = () => {
  const { token, user } = useAuth()

  document.title = "Token Terminal | Account"

  const paymentStatus = getParameterByName("payment_status")
  const [showSuccessModal, setShowSuccessModal] = useState(
    paymentStatus === "success"
  )
  if (!token) {
    return <Redirect to="/login" />
  }

  return (
    <AuthContainer>
      <AccountHeader />
      <AuthWrapper>
        <Modal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        >
          <ModalTitle>{"Payment succesful - welcome!"}</ModalTitle>
          <ModalContents>
            {
              "As a Pro user you are able to download all charts and tables in Excel. Stay tuned for more features."
            }
          </ModalContents>
        </Modal>
        <Contents paid={user.paid || false}>
          <DownloadAll />
          <ToCustomChart />
          {user && user.subscriptionType !== "paid" && (
              <BuyNow />
            /*<Elements stripe={stripePromise}>
              <BuyNow />
            </Elements>*/
          )}
        </Contents>
        <AuthSidebar>
          <AuthSidebarContents />
        </AuthSidebar>
      </AuthWrapper>
      <Favorites />
    </AuthContainer>
  )
}

export default Account

const Contents = styled.div<{ paid: boolean }>`
  flex: 2;
  padding: ${(props) => props.paid && "40px"};

  @media (max-width: 720px) {
    max-width: calc(100% - 40px);
    padding: ${(props) => props.paid && "20px"};
  }
`
