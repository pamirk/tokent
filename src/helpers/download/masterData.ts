import {
  getPercentageStrColor,
  getLabelForMasterCSV,
  reverseNumeral,
} from "helpers/numerals"
import { ProjectsType } from "types/ApiTypes"
import { Workbook } from "exceljs"
import fs from "file-saver"
import { createCSV, formatDate } from "./download"
import numeral from "numeral"

const excelTitleFontSettings = {
  name: "Helvetica Neue",
  size: 10,
  bold: true,
}

export const downloadMasterExcel = (projects: ProjectsType) => {
  const title = "Token Terminal Master Excel - " + formatDate(new Date())
  const header = Object.values(masterDataKeyMap).map((val) => val.split("(")[0])
  const data = formatProjectDataToMaster(projects, "excel")

  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet("Master")

  // Token terminal text header
  worksheet.getRow(1).height = 80
  worksheet.mergeCells("B1", "BL1")
  worksheet.views = [{ state: "frozen", xSplit: 1, ySplit: 3 }]
  const mainTitle = worksheet.getCell("A1")
  const firstRow = worksheet.getCell("B1")
  mainTitle.value = "Token Terminal Master Excel " + formatDate(new Date())

  mainTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "F3F3F3" },
  }
  firstRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "F3F3F3" },
  }

  mainTitle.font = {
    name: "Helvetica Neue",
    size: 14,
    bold: true,
  }
  mainTitle.alignment = { vertical: "middle", wrapText: true }

  const titleRow = worksheet.getRow(2)
  titleRow.height = 20

  titleRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "F3F3F3" },
  }

  // Price & market cap title
  worksheet.mergeCells("B2", "P2")
  let priceTitle = worksheet.getCell("B2")
  priceTitle.value = "Price & Market cap"

  priceTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "B6EAEF" },
  }

  priceTitle.font = excelTitleFontSettings
  priceTitle.alignment = { vertical: "middle", horizontal: "center" }

  // tvl title
  worksheet.mergeCells("Q2:Z2")
  let tvlTitle = worksheet.getCell("Q2")
  tvlTitle.value = "Total Value Locked (TVL) "

  tvlTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "F6E3AF" },
  }

  tvlTitle.font = excelTitleFontSettings
  tvlTitle.alignment = { vertical: "middle", horizontal: "center" }

  // GMV title
  const gmvTitle = worksheet.getCell("AA2")

  gmvTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD7D9" },
  }

  gmvTitle.value = "GMV"
  gmvTitle.font = excelTitleFontSettings
  gmvTitle.alignment = { vertical: "middle", horizontal: "center" }

  // Total revenue title
  worksheet.mergeCells("AB2:AI2")
  const revenueTitle = worksheet.getCell("AB2")
  revenueTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "9EFEDF" },
  }

  revenueTitle.value = "Total revenue"
  revenueTitle.font = excelTitleFontSettings

  revenueTitle.alignment = { vertical: "middle", horizontal: "center" }

  // Protocol revenue title
  worksheet.mergeCells("AJ2:AQ2")
  const protocolRevenueTitle = worksheet.getCell("AJ2")

  protocolRevenueTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "C1BBFD" },
  }

  protocolRevenueTitle.value = "Protocol revenue"
  protocolRevenueTitle.font = excelTitleFontSettings
  protocolRevenueTitle.alignment = { vertical: "middle", horizontal: "center" }

  // P/S title
  const psTitle = worksheet.getCell("AR2")
  worksheet.mergeCells("AR2:BA2")

  psTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "BFC0C0" },
  }

  psTitle.value = "Price to sales (P/S) ratio"
  psTitle.font = excelTitleFontSettings
  psTitle.alignment = { vertical: "middle", horizontal: "center" }

  // P/E title
  const peTitle = worksheet.getCell("BB2")
  worksheet.mergeCells("BB2:BK2")

  peTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "F6B9DE" },
  }

  peTitle.value = "Price to earnings (P/E) ratio"
  peTitle.font = excelTitleFontSettings
  peTitle.alignment = { vertical: "middle", horizontal: "center" }

  // Twitter
  const twitterTitle = worksheet.getCell("BL2")

  twitterTitle.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "F2D7D0" },
  }

  twitterTitle.value = "Twitter"
  twitterTitle.font = excelTitleFontSettings
  twitterTitle.alignment = { vertical: "middle", horizontal: "center" }

  // Actual project info header row
  const headerRow = worksheet.addRow(header)

  headerRow.height = 20

  headerRow.eachCell((cell:any, number:any) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D5D5D5" },
    }

    cell.font = {
      bold: true,
      color: { argb: "000" },
      size: 10,
    }

    if (number > 4) {
      cell.alignment = { horizontal: "right" }
    }
  })

  // Add data
  data.forEach((d: any) => {
    const row = worksheet.addRow(d)

    if (row.hasValues) {
      Array.isArray(row.values) &&
        row.values.forEach((value:any, index:any) => {
          // Add green / red color to percentages
          if (typeof value === "string" && value.endsWith("%")) {
            const numVal = value.split("%")[0]
            if (!!Number(numVal)) {
              row.getCell(index).value = Number(numVal)
              row.getCell(index).numFmt = "0.00%"
            } else {
              row.getCell(index).value = undefined
            }
            row.getCell(index).font = {
              // reverse numeral color for P/S and P/E (positive value = red color, negative value = green color)
              color: {
                argb:
                  index < 54
                    ? getPercentageStrColor(numVal)
                    : getPercentageStrColor(
                        reverseNumeral(Number(numVal)).toString()
                      ),
              },
            }
          } else if (typeof value === "string" && value.endsWith("$")) {
            const numVal = value.split("$")[0]
            if (!!Number(numVal)) {
              row.getCell(index).value = Number(numVal)
              row.getCell(index).numFmt = "$#,##0.00;[Red]-$#,##0.00"
            } else {
              row.getCell(index).value = undefined
            }
          } else if (typeof value === "string" && value.endsWith("RATIO")) {
            const numVal = value.split("RATIO")[0]
            if (!!Number(numVal)) {
              row.getCell(index).value = Number(numVal)
              row.getCell(index).numFmt = "0.00x"
            } else {
              row.getCell(index).value = undefined
            }
          }
        })
    }

    row.height = 20

    const nameCell = row.getCell(1)
    nameCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D5D5D5" },
    }

    nameCell.font = {
      bold: true,
    }
  })

  // Resize columns
  worksheet.columns.forEach((column: any) => {
    let maxColumnLength = 0
    column.eachCell({ includeEmpty: true }, (cell: any) => {
      maxColumnLength = Math.max(
        maxColumnLength,
        20,
        cell.value ? cell.value.toString().length : 0
      )
    })
    column.width = maxColumnLength + 2
    column.border = {
      top: { style: "double", color: { argb: "000" } },
      left: { style: "double", color: { argb: "000" } },
      bottom: { style: "double", color: { argb: "000" } },
      right: { style: "double", color: { argb: "000" } },
    }
  })

  workbook.xlsx.writeBuffer().then((data:any) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    fs.saveAs(blob, title + ".xlsx")
  })
}

export const download = (
  content: string,
  fileName: string,
  contentType: string
) => {
  const a = document.createElement("a")
  const file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

export const formatProjectDataToMaster = (
  projectData: ProjectsType,
  type: string
) => {
  const masterKeys = Object.keys(masterDataKeyMap)

  const defaultKeys = [
    "name",
    "symbol",
    "launch_date",
    "category_tags",
    "twitter_followers",
  ]

  const formatted = projectData.map((project: any) => {
    return masterKeys.map((key) => {
      if (type === "csv") {
        if (key === "category_tags") {
          return project[key].split(",").join(" ")
        } else if (defaultKeys.includes(key)) {
          return project[key]
        } else if (key.includes("_change") || key === "volmc_ratio") {
          return formatPercentage(project[key])
        } else if (key.includes("ps")) {
          return formatPercentage(project[key])
        }
        return getLabelForMasterCSV(project[key])
      } else {
        if (key === "category_tags") {
          return project[key].split(",").join(" ")
        } else if (defaultKeys.includes(key)) {
          return project[key]
        } else if (key.includes("_change") || key === "volmc_ratio") {
          // mark as percentage
          return project[key] + "%"
        } else if (key.includes("ps") || key.includes("pe")) {
          return project[key] + "RATIO"
        }
        // mark as currency
        return project[key] + "$"
      }
    })
  })

  return formatted
}

export const downloadMasterCSV = (projects: ProjectsType) => {
  const data = formatProjectDataToMaster(projects, "csv")
  const headerKeys = Object.values(masterDataKeyMap)

  createCSV("Token Terminal Master CSV", headerKeys, data)
}

export const masterDataKeyMap: { [key: string]: string } = {
  name: "Project",
  symbol: "Symbol",
  launch_date: "Launch date",
  category_tags: "Category tags",
  price: "Price latest ($)",
  price_24h_change: "24h change (%)",
  price_7d_change: "7d change (%)",
  price_30d_change: "30d change (%)",
  price_90d_change: "90d change (%)",
  price_180d_change: "180d change (%)",
  price_ath: "ATH ($)",
  price_atl: "ATL ($)",
  volume_24h: "Volume 24h ($)",
  market_cap_circulating: "Circulating market cap latest ($)",
  market_cap_fully_diluted: "Fully-diluted market cap latest ($)",
  volmc_ratio: "Volume / MC ratio (%)",
  tvl: "TVL latest ($)",
  tvl_24h_change: "24h change (%)",
  tvl_7d_change: "7d change (%)",
  tvl_30d_change: "30d change (%)",
  tvl_90d_change: "90d change (%)",
  tvl_180d_change: "180d change (%)",
  tvl_7d: "7d avg. TVL ($)",
  tvl_30d: "30d avg. TVL ($)",
  tvl_90d: "90d avg. TVL ($)",
  tvl_180d: "180d avg. TVL ($)",
  gmv_annualized: "Annualized GMV ($)",
  revenue_7d: "7d total revenue ($)",
  revenue_7d_change: "7d change (%)",
  revenue_30d: "30d total revenue ($)",
  revenue_30d_change: "30d change (%)",
  revenue_90d: "90d total revenue ($)",
  revenue_90d_change: "90d change (%)",
  revenue_180d: "180d total revenue ($)",
  revenue_180d_change: "180d change (%)",
  revenue_protocol_7d: "7d protocol revenue ($)",
  revenue_protocol_7d_change: "7d change (%)",
  revenue_protocol_30d: "30d protocol revenue ($)",
  revenue_protocol_30d_change: "30d change (%)",
  revenue_protocol_90d: "90d protocol revenue ($)",
  revenue_protocol_90d_change: "90d change (%)",
  revenue_protocol_180d: "180d protocol revenue ($)",
  revenue_protocol_180d_change: "180d change (%)",
  ps: "P/S ratio latest (x)",
  ps_24h_change: "24h change (%)",
  ps_7d_change: "7d change (%)",
  ps_30d_change: "30d change (%)",
  ps_90d_change: "90d change (%)",
  ps_180d_change: "180d change (%)",
  ps_7d: "7d avg. P/S ratio (x)",
  ps_30d: "30d avg. P/S ratio (x)",
  ps_90d: "90d avg. P/S ratio (x)",
  ps_180d: "180d avg. P/S ratio (x)",
  pe: "P/E ratio latest (x)",
  pe_24h_change: "24h change (%)",
  pe_7d_change: "7d change (%)",
  pe_30d_change: "30d change (%)",
  pe_90d_change: "90d change (%)",
  pe_180d_change: "180d change (%)",
  pe_7d: "7d avg. P/E ratio (x)",
  pe_30d: "30d avg. P/E ratio (x)",
  pe_90d: "90d avg. P/E ratio (x)",
  pe_180d: "180d avg. P/E ratio (x)",
  twitter_followers: "Twitter followers latest",
}

export const formatPercentage = (value?: number) => {
  if (!value) return undefined
  return numeral(value).multiply(100.0).format("0.00")
}
