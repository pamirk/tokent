import Button from "components/generic/button/Button"
import Modal from "components/generic/modal/Modal"
import { useAuth } from "context/AuthContext"
import { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const SampleData = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  return (
    <Container>
      <SampleButton
        name="Create your own charts"
        onClick={() =>
          user.paid
            ? (window.location.href = "/terminal/pro/custom")
            : setIsOpen(true)
        }
      />
      <SampleButton
        name="Download Master Excel"
        onClick={() =>
          user.paid ? (window.location.href = "/account") : setIsOpen(true)
        }
      />
      {isOpen && <SampleModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </Container>
  )
}

export default SampleData

type SampleModalProps = { isOpen: boolean; setIsOpen: (val: boolean) => void }

const SampleModal = ({ isOpen, setIsOpen }: SampleModalProps) => {
  const { isLoggedIn } = useAuth()

  return (
    <Modal
      title="Upgrade to Token Terminal Pro"
      show={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Text style={{ paddingTop: "30px" }}>
        {
          "Our Master Excel and custom charts are only available for Token Terminal Pro users. The Master Excel includes all of our latest data in one single data sheet and it is updated daily."
        }
      </Text>
      <Text style={{ marginTop: "50px" }}>{"Check out a sample here:"}</Text>
      <Buttons>
        <ModalButton href="https://d2kyooqkgm9ipp.cloudfront.net/Token%20Terminal%20Master%20Excel%20-%20Sample.xlsx">
          {"Download sample in Excel"}
        </ModalButton>
        <ModalButton href="https://d2kyooqkgm9ipp.cloudfront.net/Token%20Terminal%20Master%20CSV%20-%20Sample.csv">
          {"Download sample in CSV"}
        </ModalButton>
      </Buttons>
      <Text style={{ margin: "50px 0px" }}>
        {
          "Want this feature? After creating your account you can choose to upgrade to the Pro version of Token Terminal."
        }
      </Text>

      <BottomButtons>
        <ContactButton href="mailto:aleksis@tokenterminal.xyz">
          {"Contact sales"}
        </ContactButton>
        <CreateAccountButton to={isLoggedIn ? "/account" : "/login"}>
          {isLoggedIn ? "Ssubscribe" : "Create account"}
        </CreateAccountButton>
      </BottomButtons>
    </Modal>
  )
}
const Container = styled.div`
  font-family: FKGrotesk-SemiMono;
  font-size: 14px;
  margin: 10px 0px 10px 0px;
`
const BottomButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;

  @media (max-width: 720px) {
    justify-content: flex-start;
  }
`

const SampleButton = styled(Button)`
  cursor: pointer;
  border: 1px solid #00cf9d;
  width: 170px;
  height: 30px;
  font-size: 12px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #00cf9d;
  margin-left: 16px;
  margin-top: 10px;
  padding: 0px 20px;
  background: inherit;

  &:hover {
    opacity: 0.8;
  }
`

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0px;
  font-family: FKGrotesk-SemiMono;
`

const Text = styled.div`
  font-family: FKGrotesk-SemiMono;
`

const ModalButton = styled.a`
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

  width: max-content;
  padding: 10px 20px;

  height: max-content;
  line-height: unset;
`

const CreateAccountButton = styled(Link)`
  border: 1px solid #858585;
  width: max-content;
  height: 21px;
  font-size: 11px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #858585;
  margin-left: 16px;

  padding: 0px 10px;

  &:${' '}hover {
    border-color: #00cf9d;
    color: #00cf9d;
  }
`

const ContactButton = styled.a`
  border: 1px solid #858585;
  width: max-content;
  height: 21px;
  font-size: 11px;
  line-height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #858585;
  margin-left: 16px;

  padding: 0px 10px;

  &:hover {
    border-color: #00cf9d;
    color: #00cf9d;
  }
`
