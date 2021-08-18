import React from "react"
import { useAuth } from "context/AuthContext"
import styled from "styled-components"
import { Link } from "react-router-dom"

const ToCustomChart = () => {
  const { user } = useAuth()

  if (!user.paid) return null

  return (
    <Contents>
      {"Customize and create your own charts:"}

      <Button to="/terminal/pro/custom"> {"Create chart"}</Button>
    </Contents>
  )
}

export default ToCustomChart

const Contents = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
`

const Button = styled(Link)`
  margin-top: 20px;
  font-weight: 600;
  width: 300px;
  margin-bottom: 10px;
  line-height: inherit;
  border: unset;
  cursor: pointer;
  padding: 5px;
  color: white;
  background-color: #7b6af5;
  text-align: center;

  height: 36px;
  line-height: 36px;
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 720px) {
    width: 250px;
  }
`
