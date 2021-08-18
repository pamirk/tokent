import { backgroundColor, borderColor } from "context/theme"
import styled from "styled-components"

export const Contents = styled.div`
  display: flex;
  margin: 16px;
`

export const Container = styled.div`
  display: flex;
  opacity: 0.8;
  border: 0.2px solid #c4c4c4;
  background: ${backgroundColor};
  box-sizing: border-box;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
`

export const Wrapper = styled.div`
  max-width: 580px;
`

export const Title = styled.div`
  font-family: FKGrotesk-SemiMono;
  font-style: normal;
  font-weight: bold;
  font-size: 8px;

  letter-spacing: 0.06em;
  text-transform: uppercase;

  padding: 12px 16px;

  border-bottom: 1px solid ${borderColor};
`

export const Item = styled.div`
  margin: 0px 8px 8px 8px;

  &:last-of-type {
    margin-bottom: 0px;
  }
`

export const ContentsTitle = styled.div`
  display: inline-flex;
  align-items: center;
  margin-bottom: 8px;
`

export const Label = styled.div`
  display: flex;
  align-items: center;
  margin-left: 4px;

  font-family: FKGrotesk;
  font-weight: 500;
  font-size: 10px;
  line-height: 100%;
`

export const Value = styled.div`
  font-weight: 900;
  font-size: 13px;
  line-height: 16px;
`
