import { ErrorMsg } from "components/auth/AuthComponents"
import {
  backgroundColor,
  borderColor,
  textColor,
  titleWrapperColor,
} from "context/theme"
import React, { useRef } from "react"
import styled from "styled-components"
import { ModalButton } from "../modal/ModalComponents"
import X from "utils/x.svg"
import useOnClickOutside from "helpers/hooks/useOnClickOutside"
import { useData } from "context/DataContext"

type Props = {
  style?: any
  show: boolean
  onClose: () => void
  onSubmit?: () => void
  title?: string
  children: React.ReactNode
  errorMsg?: string
  submitButton?: React.ReactNode
  closeText?: string
  submitText?: string
  customButtons?: React.ReactNode
}
const Modal = ({
  errorMsg,
  style,
  onClose,
  closeText,
  onSubmit,
  submitText,
  show,
  children,
  title,
  submitButton,
  customButtons,
}: Props) => {
  const { isMobile } = useData()

  const ref = useRef(null)

  const handleClickOutside = () => onClose()

  useOnClickOutside(ref, handleClickOutside)

  if (!show) return null

  const showCloseButton = !!onClose && (!title || isMobile)

  return (
    <Container>
      <Wrapper ref={ref}>
        {title && (
          <TitleWrapper>
            {title}
            {!showCloseButton && (
              <CloseImg src={X} alt="Close" onClick={onClose} />
            )}
          </TitleWrapper>
        )}
        <Contents style={style}>{children}</Contents>
        <Buttons>
          {customButtons}
          {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
          {submitButton}
          {onSubmit && <ModalButton onClick={onSubmit} name={submitText} />}
          {showCloseButton && (
            <ModalButton onClick={onClose} name={closeText} />
          )}
        </Buttons>
      </Wrapper>
    </Container>
  )
}

Modal.defaultProps = { submitText: "Submit", closeText: "Close" }

export default Modal

const CloseImg = styled.img`
  cursor: pointer;
  height: 12px;
  margin: 0px;

  &:hover {
    opacity: 0.7;
  }
`

const TitleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 16px 32px;
  align-items: center;
  border-bottom: 1px solid ${borderColor};

  background-color: ${titleWrapperColor};
  color: ${textColor};

  font-size: 22px;
  line-height: 24px;
  height: calc(80px - 32px);

  @media (max-width: 720px) {
    padding: 16px;
    padding-right: 30px;
    flex-direction: column;
  }
`

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
`

const Wrapper = styled.div`
  position: fixed;
  background: ${backgroundColor};
  width: 60%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: 720px) {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
`

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
  padding: 0px 32px;

  @media (max-width: 720px) {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`

const Contents = styled.div`
  padding: 16px 32px 8px 32px;

  @media (min-width: 720px) {
    max-height: 90vh;
    overflow: auto;
  }
`
