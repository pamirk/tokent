import React from "react"
import { useAuth } from "context/AuthContext"
import styled from "styled-components"
import Button from "components/generic/button/Button"

import {
  downloadMasterCSV,
  downloadMasterExcel,
} from "helpers/download/masterData"
import { useData } from "context/DataContext"

const DownloadAll = () => {
  const { projects } = useData()
  const { user } = useAuth()

  if (!user.paid || !projects) return null

  return (
    <Contents>
      {
        "You can download all tables and charts by clicking on the download button in the lower right corner of the table / chart. "
      }
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        {"You can also download all of our data here:"}
      </div>
      <DownloadButton
        onClick={() => downloadMasterExcel(projects)}
        name="Download our Master sheet in Excel"
      />
      <DownloadButton
        onClick={() => downloadMasterCSV(projects)}
        name="Download our Master sheet in CSV"
      />
      {user.subscriptionType === "trial" && (
        <Text>
          {
            "Want to continue using these features after the trial? Get access below!"
          }
        </Text>
      )}
    </Contents>
  )
}

export default DownloadAll

const Text = styled.div`
  margin-top: 20px;
  font-size: 12px;
`
const Contents = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 20px;
`

const DownloadButton = styled(Button)`
  font-weight: 600;
  width: 300px;
  margin-bottom: 10px;
  line-height: inherit;
  border: unset;
  cursor: pointer;
  padding: 5px;
  color: white;
  background-color: #00cf9d;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 720px) {
    width: 250px;
  }
`
