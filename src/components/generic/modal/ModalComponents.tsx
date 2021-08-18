import { borderColor } from "context/theme"
import styled from "styled-components"
import Button from "../button/Button"

export const ModalTitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  padding-left: 40px;
  line-height: 64px;
  height: 64px;
  border-bottom: 1px solid ${borderColor};
`

export const ModalContents = styled.div`
  padding: 16px 40px;
`

export const ModalButton = styled(Button)`
  font-size: 11px;
  line-height: 100%;

  background: transparent;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 128px;
  height: 22px;

  border: 1px solid #00cf9d;
  color: #00cf9d;
  cursor: pointer;

  margin-left: 10px;

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 720px) {
    margin-bottom: 5px;
  }
`
