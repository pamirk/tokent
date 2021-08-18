import styled from "styled-components"

type Props = {
  style?: any
  title: string
  text: string
  url?: string
  urlText: string
  email?: string
}

const Card = (props: Props) => {
  const { style, url, title, text, urlText, email } = props
  if (url || email) {
    return (
      <StyledLink href={url || email}>
        <Container style={style}>
          <Title>{title}</Title>
          <Text>{text}</Text>
          {urlText && <UrlText>{urlText}</UrlText>}
        </Container>
      </StyledLink>
    )
  }

  return (
    <Container style={style}>
      <Title>
        <p>{title}</p>
      </Title>
      <Text>{text}</Text>
    </Container>
  )
}

export default Card

const UrlText = styled.div`
  position: absolute;
  bottom: 8%;
  font-size: 14px;
`

const StyledLink = styled.a`
  flex: 1;
  color: inherit;
  text-decoration: none;
  font-family: FKGrotesk-SemiMono;
`

const Container = styled.div`
  height: 200px;
  padding: 32px 32px;
  position: relative;
  flex: 1;
  cursor: pointer;
  &:hover {
    background: #e95626;
    color: #ffffff;
    opacity: 0.9;
  }

  @media (max-width: 720px) {
    height: auto;
  }
`

const Title = styled.div`
  font-size: 22px;
  line-height: 126%;
  margin-bottom: 16px;

  @media (max-width: 720px) {
    font-size: 16px;
  }
`

const Text = styled.div`
  font-size: 14px;
  line-height: 126%;
  margin-bottom: 50px;

  @media (max-width: 720px) {
    font-size: 12px;
  }
`
