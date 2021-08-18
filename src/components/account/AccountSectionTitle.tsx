import { AuthTitle } from "components/auth/AuthComponents"
import { Hide, Img } from "components/generic/charts/ChartComponents"
import ArrowUp from "utils/arrowUp.svg"
import ArrowDown from "utils/arrowDown.svg"
import styled from "styled-components"

type Props = {
  title: string
  isOpen?: boolean
  canToggle: boolean
  img?: string
  toggleIsOpen?: () => void
}
const AccountSectionTitle = (props: Props) => {
  const { isOpen, title, canToggle, img, toggleIsOpen } = props

  return (
    <AuthTitle style={{ justifyContent: "space-between" }}>
      <div style={{ alignItems: "center", display: "flex" }}>
        {img && <Image src={img} alt="Auth" />} {title}
      </div>
      {canToggle && (
        <Hide style={{ marginRight: "30px" }} onClick={toggleIsOpen}>
          {isOpen ? "Hide" : "Show"}
          <Img src={isOpen ? ArrowUp : ArrowDown} alt="Toggle visibility" />
        </Hide>
      )}
    </AuthTitle>
  )
}

export default AccountSectionTitle

AccountSectionTitle.defaultProps = { canToggle: true }
const Image = styled.img`
  margin-right: 16px;
`
