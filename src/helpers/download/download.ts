import { getLabelForMasterCSV } from "helpers/numerals"
import { formatPercentage } from "./masterData"
import { projectKeysMap } from "./utils"

export function createCSV(
  filename: string,
  header: string[],
  data: string[][]
) {
  let csv = header + "\r\n"
  data.forEach(function (row) {
    csv += row.join(",")
    csv += "\n"
  })

  var hiddenElement = document.createElement("a")
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv)
  hiddenElement.target = "_blank"
  hiddenElement.download =
    capitalize(filename) + " " + formatDate(new Date()) + ".csv"
  hiddenElement.click()
}

export const downloadCSVFromJson = (
  filename: string,
  data: any[],
  percentageShare?: boolean,
  customHeader?: string[]
) => {
  // convert JSON to CSV

  let csvHeader

  if (!customHeader) {
    csvHeader = Object.keys(data[0]).map((key) => {
      if (key === "datetime") return "Date"
      return (
        projectKeysMap[key] ||
        `${capitalize(key)} ${percentageShare ? " (%)" : " ($)"}`
      )
    })
  } else {
    csvHeader = customHeader
  }
  const defaultKeys = ["name", "project", "twitter_followers"]

  const csv = data.map((row) =>
    Object.keys(data[0])
      .map((fieldName) => {
        if (defaultKeys.includes(fieldName)) {
          return row[fieldName]
        } else if (fieldName === "datetime") {
          // for competitive the datetime is a Date object not string
          // so need to check for type before doing anything to the value
          if (typeof row[fieldName] === "string") {
            return row[fieldName].split("T")[0]
          }
          return row[fieldName].toISOString().split("T")[0]
        } else if (
          fieldName.includes("_change") ||
          fieldName === "volmc_ratio"
        ) {
          return formatPercentage(row[fieldName])
        } else if (percentageShare) {
          return row[fieldName]
        }

        return getLabelForMasterCSV(row[fieldName])
      })
      .join(",")
  )
  csv.unshift(csvHeader.join(","))
  const csvStr = csv.join("\r\n")

  const link = document.createElement("a")
  link.setAttribute(
    "href",
    "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(csvStr)
  )
  link.setAttribute(
    "download",
    capitalize(filename) + " " + formatDate(new Date()) + ".csv"
  )
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const formatDate = (date: Date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = "0" + month
  if (day.length < 2) day = "0" + day

  return [year, month, day].join("-")
}

export const capitalize = (value: string) =>
  value.replace(/\b\w/g, (l) => l.toUpperCase())
