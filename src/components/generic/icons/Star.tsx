import { useState } from "react"
import styled from "styled-components"

import StarIcon from "utils/star.svg"
import StarRate from "utils/star_rate.svg"

type Props = {
  onClick: () => void
  isSelected: boolean
  showNotification?: boolean
}
const Star = (props: Props) => {
  const { onClick, isSelected, showNotification } = props
  const [isNotificationVisible, setIsNotificationvisible] = useState(false)
  const [notification, setNotification] = useState("")

  const handleStarClick = () => {
    onClick()

    if (!showNotification) return
    if (isSelected) {
      setNotification("Removed from favorites.")
    } else {
      setNotification("Saved to favorites!")
    }

    setIsNotificationvisible(true)
    setTimeout(() => {
      setIsNotificationvisible(false)
    }, 3000)
  }

  return (
    <Container>
      <Img src={isSelected ? StarIcon : StarRate} onClick={handleStarClick} />
      {isNotificationVisible && showNotification && <Text>{notification}</Text>}
    </Container>
  )
}

Star.defaultProps = { showNotification: true }
const Img = styled.img`
  cursor: pointer;

  height: 21px;
  width: 21px;
`

const Text = styled.div`
  font-size: 14px;
  margin-left: 5px;
  margin-top: 3px;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  @media (max-width: 720px) {
    flex-direction: column;
  }

  &:hover {
    opacity: 0.8;
  }
`
export default Star
