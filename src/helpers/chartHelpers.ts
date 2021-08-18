import {
    BulkMetricsStore,
    MarketMetricsState,
    PEMetricsState,
    ProjectMetricsType,
    ProjectMetricType,
    PSMetricsState,
    RevenueMetricsState,
    Top10ProjectMetrics,
    TVLMetricsState,
} from "types/ApiTypes"
import {flattenDeep, groupBy, isNil, omitBy, pickBy, sortBy, sumBy, toArray,} from "lodash"

export const months = [
    {short: "Jan", full: "January"},
    {short: "Feb", full: "February"},
    {short: "Mar", full: "March"},
    {short: "Apr", full: "April"},
    {short: "May", full: "May"},
    {short: "Jun", full: "June"},
    {short: "Jul", full: "July"},
    {short: "Aug", full: "August"},
    {short: "Sep", full: "September"},
    {short: "Oct", full: "October"},
    {short: "Nov", full: "November"},
    {short: "Dec", full: "December"},
]

export const cleanChartData = (arr: any[], keys: string[] | string) => {
    if (Array.isArray(keys)) {
        const idx = arr.findIndex((o) => keys.find((k) => o[k] > 0))
        if (idx === -1) {
            return []
        }
        const newArr = arr.slice(idx)
        return newArr
    }
    const idx = arr.findIndex((o) => o[keys] > 0)
    if (idx === -1) {
        return []
    }

    const newArr = arr.slice(idx)
    return newArr
}

export type RevenueChartEntry = {
    label: string
    [key: string]: any
}

export const hasData = (key?: string | string[], dataset?: any[]) => {
    if (!key || !dataset) return false

    if (Array.isArray(key)) {
        const results = key.map((k) =>
            dataset.some((item) => !!item[k] && item[k] > 0)
        )
        return results.some((value) => value === true)
    }
    return dataset.some((item) => !!item[key] && item[key] > 0)
}

const daysAgo = (prevDate: Date) => {
    const msPerDay = 8.64e7

    const today = new Date()
    return Math.round((today.getTime() - prevDate.getTime()) / msPerDay)
}

export const labelProjectDefaultData = (
    defaultProjectMetrics: ProjectMetricsType,
    dailyProjectMetrics: ProjectMetricsType,
    monthlyProjectMetrics: ProjectMetricsType,
    selectedLength: number,
    chartType: string,
    isNFTOrExchange?: boolean
) => {
    const isDaily = selectedLength <= 365
    let labeled: ProjectMetricsType = []
    if (selectedLength <= 180 && defaultProjectMetrics !== undefined)
        labeled = defaultProjectMetrics
    if (
        selectedLength > 180 &&
        selectedLength <= 365 &&
        dailyProjectMetrics !== undefined
    )
        labeled = dailyProjectMetrics
    if (selectedLength > 365 && defaultProjectMetrics !== undefined)
        labeled = monthlyProjectMetrics

    if (isDaily) {
        if (!labeled) return []

        const filtered = labeled.filter(
            (entry:any) =>
                !!entry && daysAgo(new Date(entry.datetime)) <= selectedLength + 1
        )

        labeled = filtered.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCDate(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCDate() +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
        }))
    } else {
        if (!labeled) return []

        labeled = labeled.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
        }))
    }

    if (chartType === "cumulative") {
        const cumulativeResult = [...labeled].reverse()
        const cumulative = {
            revenue: 0,
            revenue_protocol: 0,
            revenue_supply_side: 0,
            gmv: 0,
            volume: 0,
            token_incentives: 0,
        }
        cumulativeResult.forEach((entry, i) =>
            Object.keys(entry).forEach((key) => {
                switch (key) {
                    case "revenue":
                    case "revenue_protocol":
                    case "revenue_supply_side":
                    case "volume":
                    case "token_incentives":
                        cumulative[key] += entry[key] || 0
                        cumulativeResult[i][key] = cumulative[key]
                        break
                    case "gmv":
                        if (isNFTOrExchange) {
                            cumulative[key] += entry[key] || 0
                            cumulativeResult[i][key] = cumulative[key]
                        }
                }
            })
        )

        return cumulativeResult
    }

    return labeled.reverse()
}

export const labelCompetitiveChart = (
    data: BulkMetricsStore,
    selectedLength: number,
    chartMetric: string,
    isExchange: boolean,
    chartType?: string
) => {
    const isDaily = selectedLength <= 365
    if (isDaily) {
        if (!data || !data.daily) return []
        const projectNames = Object.keys(data.daily).filter(
            (name) => name !== "success"
        )

        const result: any[] = projectNames.map((name) =>
            !!data.daily
                ? data.daily[name].map((entry:any) => {
                    const value: number = (entry as any)[chartMetric]
                    return {
                        [entry.project]: value,
                        datetime: new Date(entry.datetime),
                        label:
                            months[new Date(entry.datetime).getUTCMonth()].short +
                            " " +
                            new Date(entry.datetime).getUTCDate(),
                        tooltipLabel:
                            months[new Date(entry.datetime).getUTCMonth()].full +
                            " " +
                            new Date(entry.datetime).getUTCDate() +
                            " " +
                            new Date(entry.datetime).getUTCFullYear(),
                    }
                })
                : []
        )

        const flattened = flattenDeep(result)

        const groupedArr = toArray(groupBy(flattened, "datetime"))

        const results = groupedArr
            .map((day) =>
                day.reduce(function (result, current) {
                    return Object.assign(result, current)
                }, {})
            )
            .filter((entry) => daysAgo(entry.datetime) <= selectedLength + 1)

        const sortedResults = sortBy(results, "datetime")

        if (
            chartType === "cumulative" &&
            allowedCumulativeMetrics
                .filter((metric) => metric !== "gmv")
                .includes(chartMetric)
        ) {
            return toCumulative([...sortedResults], isExchange)
        }

        return sortedResults
    } else {
        if (!data || !data.monthly) return []

        const projectNames = Object.keys(data.monthly).filter(
            (name) => name !== "success"
        )

        const result: any[] = projectNames.map((name) =>
            !!data.monthly
                ? data.monthly[name].map((entry:any) => {
                    const value: number = (entry as any)[chartMetric]
                    return {
                        [entry.project]: value,
                        datetime: entry.datetime,
                        label:
                            months[new Date(entry.datetime).getUTCMonth()].short +
                            " " +
                            new Date(entry.datetime).getUTCFullYear(),
                        tooltipLabel:
                            months[new Date(entry.datetime).getUTCMonth()].full +
                            " " +
                            new Date(entry.datetime).getUTCFullYear(),
                    }
                })
                : []
        )
        const flattened = flattenDeep(result)
        const groupedArr = toArray(groupBy(flattened, "datetime"))
        const results = groupedArr.map((day) =>
            day.reduce(function (result, current) {
                return Object.assign(result, current)
            }, {})
        )

        const sortedResults = sortBy(results, "datetime")

        if (
            chartType === "cumulative" &&
            allowedCumulativeMetrics.includes(chartMetric)
        ) {
            return toCumulative([...sortedResults], isExchange)
        }

        return sortedResults
    }
}

export const labelProjectTop10 = (
    defaultTop10Metrics: Top10ProjectMetrics,
    dailyTop10Metrics: Top10ProjectMetrics,
    monthlyTop10Metrics: Top10ProjectMetrics,
    selectedLength: number,
    chartType: string,
    isExchange: boolean,
    metric?: string
) => {
    if (!metric) return []
    const isDaily = selectedLength <= 365
    let labeled: Top10ProjectMetrics = []
    if (selectedLength <= 180 && defaultTop10Metrics !== undefined)
        labeled = defaultTop10Metrics
    if (
        selectedLength > 180 &&
        selectedLength <= 365 &&
        dailyTop10Metrics !== undefined
    )
        labeled = dailyTop10Metrics
    if (selectedLength > 365 && monthlyTop10Metrics !== undefined)
        labeled = monthlyTop10Metrics

    if (isDaily) {
        if (!labeled) return []
        const filtered = labeled.filter(
            (entry:any) => daysAgo(new Date(entry.datetime)) <= selectedLength + 1
        )

        labeled = filtered.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCDate(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCDate() +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
        }))
    } else {
        if (!labeled) return []

        labeled = labeled.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
        }))
    }

    const groupedArr = toArray(groupBy(labeled, "label"))

    const groupedComponents = groupedArr.map((entry) =>
        toArray(groupBy(entry, "component"))
    )

    const result = groupedComponents.map((entry) =>
        entry.map((component: any) => ({
            label: component[0].label,
            datetime: component[0].datetime,
            tooltipLabel: component[0].tooltipLabel,
            [component[0].component]: sumBy(component, metric),
        }))
    )

    const results = result.map((day) =>
        day.reduce(function (result, current) {
            return Object.assign(result, current)
        }, {})
    )
    if (chartType === "cumulative" && allowedCumulativeMetrics.includes(metric)) {
        const cumulativeResult: any = toCumulative(
            [...results].reverse(),
            isExchange
        )

        return cumulativeResult
    }

    // filter out values of undefined, null and 0, if day has no entries with positive value, filter that day out
    const final = results
        .filter((entry) => Object.keys(pickBy(entry)).length > 3)
        .map((entry) => omitBy(entry, isNil))
        .reverse()

    return final
}

export const labelRevenueMetrics = (
    data: RevenueMetricsState,
    selectedLength: number,
    category: string[],
    chartType: string,
    metric: string
) => {
    const isDaily = selectedLength <= 365
    let labeled = []

    const currentData = isDaily ? data.daily : data.monthly
    if (!currentData) return []

    const filtered = currentData.filter(
        (entry:any) =>
            category.includes(entry.category) &&
            daysAgo(new Date(entry.datetime)) <= selectedLength
    )

    if (isDaily) {
        labeled = filtered.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCDate(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCDate() +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
        }))
    } else {
        labeled = filtered.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
        }))
    }

    const groupedArr = toArray(groupBy(labeled, "label"))
    const result = groupedArr.map((daily) =>
        daily.map((entry) => {
            const value: number = (entry as any)[metric]

            return {
                label: entry.label,
                datetime: entry.datetime,
                tooltipLabel: entry.tooltipLabel,
                [entry.project]: value,
                category: entry.category,
            }
        })
    )

    const results = result.map((day) =>
        day.reduce(function (result, current) {
            return Object.assign(result, current)
        }, {})
    )

    if (chartType === "cumulative") {
        return toCumulative([...results].reverse(), true)
    }

    // remove entries with null or zero value
    const final = results
        .map((day) => omitBy(day, (val) => isNil(val) || val === 0))
        .filter((day) => Object.keys(day).length > 4)

    return final.reverse()
}

export const labelCumulativeRevenueMetrics = (
    data: RevenueMetricsState,
    selectedLength: number,
    category: string[],
    chartType: string
) => {
    let labeled = []

    const currentData = selectedLength <= 365 ? data.daily : data.monthly
    if (!currentData) return []

    const filtered = currentData.filter(
        (entry:any) =>
            daysAgo(new Date(entry.datetime)) <= selectedLength &&
            category.includes(entry.category)
    )

    labeled = filtered.map((entry:any) => ({
        ...entry,
        label:
            months[new Date(entry.datetime).getUTCMonth()].short +
            " " +
            new Date(entry.datetime).getUTCDate(),
    }))

    const groupedArr = toArray(groupBy(labeled, "project"))

    const result = groupedArr.map((entry) => ({
        project: entry[0].project,
        label: entry[0].label,
        category: entry[0].category,
        [chartType]: sumBy(entry, chartType),
    }))

    const sorted = sortBy(result, chartType)

    const final = sorted.filter((day: any) => day[chartType] > 0)

    return final
}

export const labelMarketMetrics = (
    data: MarketMetricsState,
    selectedLength: number,
    metric: string,
    chartType: string,
    isExchange: boolean,
    keys?: string[]
) => {
    const isDaily = selectedLength <= 365
    const currentData = isDaily ? data.daily : data.monthly
    if (!currentData) return []

    let labeled = []

    const filtered = currentData.filter((entry) => {
        if (keys) {
            return (
                daysAgo(new Date(entry.datetime)) <= selectedLength &&
                keys.includes(entry.project) &&
                metric === entry.metric
            )
        }
        return (
            daysAgo(new Date(entry.datetime)) <= selectedLength &&
            metric === entry.metric
        )
    })

    if (isDaily) {
        labeled = filtered.map((entry) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCDate(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCDate() +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
        }))
    } else {
        labeled = filtered.map((entry) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                +new Date(entry.datetime).getUTCFullYear(),
        }))
    }

    const groupedArr = toArray(groupBy(labeled, "label"))

    const result = groupedArr.map((daily) =>
        daily.map((entry:any) => ({
            label: entry.label,
            datetime: entry.datetime,
            tooltipLabel: entry.tooltipLabel,
            [entry.project]: entry.value,
        }))
    )

    const results = result.map((day) =>
        day.reduce(function (result, current) {
            return Object.assign(result, current)
        }, {})
    )

    if (chartType === "cumulative" && allowedCumulativeMetrics.includes(metric)) {
        return toCumulative([...results].reverse(), isExchange)
    }

    // remove entries with null/undefined/0 value
    const final = results.map((day) =>
        omitBy(day, (val) => isNil(val) || val === 0)
    )

    return final.reverse()
}

export const labelPSData = (
    data: PSMetricsState,
    selectedLength: number,
    category: string[]
) => {
    const currentData = selectedLength <= 365 ? data.daily : data.monthly
    if (!currentData) return []

    let result

    if (selectedLength === 1) {
        let projects = new Set()
        currentData.forEach(
            (entry) =>
                category.includes(entry.category) && projects.add(entry.project)
        )

        result = Array.from(projects).map((project) =>
            currentData.find((entry) => entry.project === project)
        )
    } else {
        const filtered = currentData.filter(
            (entry) =>
                daysAgo(new Date(entry.datetime)) <= selectedLength &&
                category.includes(entry.category)
        )

        const labeled = filtered.map((entry) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCDate(),
        }))

        const groupedArr = toArray(groupBy(labeled, "project"))

        result = groupedArr.map((entry) => ({
            project: entry[0].project,
            label: entry[0].label,
            category: entry[0].category,
            ps: sumBy(entry, "ps") / entry.length,
        }))
    }

    const sorted = sortBy(result, "ps")

    return sorted.reverse()
}

export const labelPEData = (
    data: PEMetricsState,
    selectedLength: number,
    category: string[]
) => {
    const currentData = selectedLength <= 365 ? data.daily : data.monthly
    if (!currentData) return []

    let result

    if (selectedLength === 1) {
        let projects = new Set()
        currentData.forEach(
            (entry:any) =>
                category.includes(entry.category) && projects.add(entry.project)
        )

        result = Array.from(projects).map((project) =>
            currentData.find((entry:any) => entry.project === project)
        )
    } else {
        const filtered = currentData.filter(
            (entry:any) =>
                daysAgo(new Date(entry.datetime)) <= selectedLength &&
                category.includes(entry.category)
        )

        const labeled = filtered.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCDate(),
        }))

        const groupedArr = toArray(groupBy(labeled, "project"))

        result = groupedArr.map((entry) => ({
            project: entry[0].project,
            label: entry[0].label,
            category: entry[0].category,
            pe: sumBy(entry, "pe") / entry.length,
        }))
    }

    const sorted = sortBy(result, "pe")

    return sorted
        .reverse()
        .filter((entry: any) => !!entry && !!entry.pe && entry.pe < 1000)
}

export const labelTotalTVLData = (
    data: TVLMetricsState,
    selectedLength: number,
    category: string
) => {
    const currentData = selectedLength <= 365 ? data.daily : data.monthly
    if (!currentData) return []

    let result

    if (selectedLength === 1) {
        let projects = new Set()
        currentData.forEach(
            (entry:any) =>
                category.includes(entry.category) && projects.add(entry.project)
        )

        result = Array.from(projects).map((project) =>
            currentData.find((entry:any) => entry.project === project)
        )
    } else {
        const filtered = currentData.filter(
            (entry:any) =>
                daysAgo(new Date(entry.datetime)) <= selectedLength &&
                category === entry.category
        )

        const labeled = filtered.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCDate(),
        }))

        const groupedArr = toArray(groupBy(labeled, "project"))

        result = groupedArr.map((entry) => ({
            project: entry[0].project,
            label: entry[0].label,
            category: entry[0].category,
            tvl: sumBy(entry, "tvl") / entry.length,
        }))
    }
    const sorted = sortBy(result, "tvl")

    return sorted.slice(-20)
}

export const labelTVLMetrics = (
    data: TVLMetricsState,
    selectedLength: number,
    category: string[]
) => {
    const isDaily = selectedLength <= 365
    let labeled = []

    const currentData = isDaily ? data.daily : data.monthly
    if (!currentData) return []

    const filtered = currentData.filter(
        (entry:any) =>
            category.includes(entry.category) &&
            daysAgo(new Date(entry.datetime)) <= selectedLength
    )

    if (isDaily) {
        labeled = filtered.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCDate(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCDate() +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
        }))
    } else {
        labeled = filtered.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
        }))
    }

    const groupedArr = toArray(groupBy(labeled, "label"))

    const result = groupedArr.map((daily) =>
        daily.map((entry) => {
            const value: number = (entry as any)["tvl"]

            return {
                label: entry.label,
                datetime: entry.datetime,
                tooltipLabel: entry.tooltipLabel,
                [entry.project]: value,
                category: entry.category,
            }
        })
    )

    const results = result.map((day) =>
        day.reduce(function (result, current) {
            return Object.assign(result, current)
        }, {})
    )

    // remove entries with null or zero value
    const final = results
        .map((day) => omitBy(day, (val) => isNil(val) || val === 0))
        .filter((day) => Object.keys(day).length > 4)

    return final.reverse()
}

export const allowedCumulativeMetrics = [
    "revenue",
    "revenue_supply_side",
    "revenueSupplySide",
    "revenue_protocol",
    "revenueProtocol",
    "volume",
    "token_incentives",
    "gmv",
]

const toCumulative = (data: any, isExchange: boolean) => {
    const cumulativeResult: any = data
    const cumulative: any = {}
    cumulativeResult.forEach((entry: any, i: number) =>
        Object.keys(entry).forEach((key) => {
            switch (key) {
                case "label":
                case "datetime":
                case "tooltipLabel":
                    return
                default:
                    if (!isExchange && key === "gmv") return

                    cumulative[key] = cumulative[key]
                        ? cumulative[key] + entry[key]
                        : entry[key] || 0
                    cumulativeResult[i][key] = cumulative[key]
            }
        })
    )

    return cumulativeResult
}

export const labelCustomChartData = (
    selectedLength: number,
    data: ProjectMetricsType,
    projectName?: string,
    metric?: string
) => {
    if (!data || !metric) return []

    const isDaily = selectedLength <= 365

    const filterData = (data: ProjectMetricsType): ProjectMetricType[] => {
        if (!data) return []
        return data.filter(
            (entry:any) =>
                !!entry && daysAgo(new Date(entry.datetime)) <= selectedLength + 1
        )
    }

    const labelDailyData = (data: ProjectMetricsType): ProjectMetricType[] => {
        if (!data) return []
        return data.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCDate(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCDate() +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
        }))
    }

    const labelMonthlyData = (data: ProjectMetricsType) => {
        if (!data) return []

        return data.map((entry:any) => ({
            ...entry,
            label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
            tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCFullYear().toString(),
        }))
    }

    const filtered = filterData(data)

    let labeled: any[] = []
    if (isDaily) {
        labeled = labelDailyData(filtered)
    } else {
        labeled = labelMonthlyData(filtered)
    }

    const finalData = labeled
        .map((entry) => ({
            [metric + "-" + projectName]: entry[metric],
            tooltipLabel: entry.tooltipLabel,
            label: entry.label,
            datetime: entry.datetime,
        }))
        .reverse()

    const firstDataPoint = finalData.findIndex(
        (e: any) => e[metric + "-" + projectName] > 0
    )

    if (firstDataPoint > 0) {
        finalData.splice(0, firstDataPoint)
    }

    return finalData
}
