import React, { useState } from "react"
import styled from "styled-components"
import AccountLinks from "./AccountLinks"
import { useAuth } from "context/AuthContext"
import { months } from "helpers/chartHelpers"
import { copyToClipboard } from "helpers/copyToClipboard"
import { Link } from "react-router-dom"

export const AuthSidebarContents = () => {
  const { user } = useAuth()
  console.log(user)
  const [copied, setCopied] = useState(false)

  const copyApiKey = () => {
    if (!user.apiToken) return
    copyToClipboard(user.apiToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <>
      <AccountLinks />
      <AccountText>
        {user.subscriptionType === "paid" && (
          <PaidUserText subscription={user.subscription} />
        )}
        {user.subscriptionType === "trial" && (
          <TrialUserText trial={user.trial} />
        )}
        {!user.paid && (
          <Text>
            {
              "You are on a freemium plan. Upgrade to Token Terminal Pro to unlock all features."
            }
          </Text>
        )}

        {!user.paid && user.apiToken && (
          <>
            <ApiKeyText style={{ width: "100%" }}>
              <Text style={{ marginBottom: "5px" }}>{"API key:"}&nbsp;</Text>
              <Text
                onClick={copyApiKey}
                style={{ cursor: "pointer", color: "#FF9F43" }}
              >
                {user.apiToken}
              </Text>
            </ApiKeyText>
            {copied && <Text>{"API key copied to clipboard"}</Text>}
          </>
        )}
        <ApiDocs
          to={{ pathname: "https://docs.tokenterminal.com/api" }}
          target="_blank"
        >
          {"API documentation"}
        </ApiDocs>
      </AccountText>
    </>
  )
}

export default AuthSidebarContents

type PaidUserTextProps = {
  subscription: {
    cancelAtPeriodEnd: boolean
    currentPeriodEnd: string
    currentPeriodStart: string
    status: string
  }
}

const PaidUserText = (props: PaidUserTextProps) => {
  const { subscription } = props

  const formatEndDate = () => {
    if (!subscription.currentPeriodEnd) return ""

    const time = new Date(subscription.currentPeriodEnd)
    const str =
      months[time.getUTCMonth()].full +
      " " +
      time.getUTCDate() +
      " " +
      time.getUTCFullYear()
    return str
  }

  return (
    <>
      <Text>{"You are on a Pro plan. Few understand."}</Text>
      {subscription.cancelAtPeriodEnd && (
        <Text>
          {"Your Pro subscription is valid until " + formatEndDate() + "."}
        </Text>
      )}
      {!subscription.cancelAtPeriodEnd && (
        <Text>
          {"The next billing date for your Pro subscription is " +
            formatEndDate() +
            "."}
        </Text>
      )}
    </>
  )
}

type TrialUserTextProps = {
  trial: {
    startsAt?: string
    endsAt?: string
  }
}

const TrialUserText = (props: TrialUserTextProps) => {
  const { trial } = props

  const formatEndDate = () => {
    if (!trial.endsAt) return "3d"

    const dayDiff = new Date(trial.endsAt).getDate() - new Date().getDate()

    return dayDiff + "d"
  }

  return (
    <>
      <Text>{"You are on a trial for a Pro plan. Few understand."}</Text>

      <Text>{"Your trial ends in: " + formatEndDate()}</Text>
    </>
  )
}

const Text = styled.div`
  margin-bottom: 16px;
  line-height: 19px;
`

const AccountText = styled.div`
  padding: 40px;
`

const ApiKeyText = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
`

const ApiDocs = styled(Link)`
  margin-bottom: 16px;
  line-height: 19px;
  text-decoration: underline;
  color: inherit;

  &:hover {
    opacity: 0.8;
  }
`
