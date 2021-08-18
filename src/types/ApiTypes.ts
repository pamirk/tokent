export type ProjectsType = ProjectType[]
export type ProjectType = {
    pe: any;
    pe_180d_change: any;
    pe_90d_change: any;
    pe_30d_change: any;
    pe_7d_change: any;
    pe_24h_change: any;
    revenue_protocol_annualized: any;
    ps_90d_change: any;
    volume_24h: number;
    price_atl: number;
    price_ath: number;
    price_180d_change: number;
    price_30d_change: number;
    price_7d_change: number;
    price_24h_change: number;
    description: string | any;
    exchanges: any;
    price: number;
    gmv_annualized: number;
    market_cap_fully_diluted: number;
    market_cap_circulating: number;
    symbol: string;
    tvl_30d: number;
    tvl_180d_change: number;
    tvl_30d_change: number;
    tvl_7d_change: number;
    tvl_24h_change: number;
    tvl: number;
    revenue_180d_change: number;
    revenue_30d_change: number;
    revenue_7d_change: number;
    revenue_24h_change: number;
    revenue_180d: number;
    revenue_30d: number;
    revenue_7d: number;
    revenue_24h: number;
    ps_180d_change: number;
    ps_30d_change: number;
    ps_7d_change: number;
    ps_24h_change: number;
    revenue_annualized: number;
    category_tags: string;
    project_id: string;
    logo: string;
    ps: number;
    revenue_protocol_180d_change: number;
    revenue_protocol_30d_change: number;
    revenue_protocol_7d_change: number;
    revenue_protocol_24h_change: number;
    revenue_protocol_180d: number;
    revenue_protocol_30d: number;
    revenue_protocol_7d: number;
    revenue_protocol_24h: number;
    market_cap: number;
    name: string;
    metric_availability: any;
}

export type ProjectMetricsType = any
export type ProjectMetricsStore = any

export type ProjectTop10Metrics = any
export type MarketsType = Array<MarketType>
export type MarketType = {
    market_id: string
    market: string
    ps_median: number
    revenue_median: number
    revenue_total: number
    project_dominance: number
    project: string
}

export type MarketMetricsType = any
export type AuthType = any
export type UserDataType = any
export type PSInfoType = Array<{
    ps_lowest: number;
    ps_highest: number;
    category: string;
}>

export type RevenueInfoType = Array<{
    project_dominance: number;
    project: string;
    revenue_total: number;
    category: string;

}>
export type RevenueProtocolInfoType = Array<{
    project_dominance: number;
    project: string;
    revenue_protocol_total: number;
    category: string;

}>
export type PSMetricsState = {
    daily: PSMetricsType[] | undefined;
    monthly: PSMetricsType[] | undefined;

}
export type PSMetricsType = {
    datetime: string;
    category: string;
    project: string;

}

export type RevenueMetricsState = {
    monthly: any;
    daily: any;
}
export type RevenueMetricsType = {
    category: string;
    datetime: string;

}
/*export type TVLMetricsState = {
    monthly: TVLInfoType[] | undefined;
    daily: TVLInfoType[] | undefined;
}
export type TVLInfoType = {
    datetime: string;
    project: string;
    category: string;
}*/
export type TVLMetricsState = any
export type TVLInfoType = any
export type TVLMetricsType = any
export type Top10ProjectMetrics = any
export type PEInfoType = any
export type PEMetricsType = any
export type FeedItemType = any
export type ProjectMetricType = any
export type PEMetricsState = any


export type BulkMetricsStore = {
    monthly: any;
    daily: any;
}
export type BulkMetrics = any

export type MarketMetricsState = {
    monthly: MarketMetricType[] | undefined;
    daily: MarketMetricType[] | undefined;

}
export type MarketMetricType = {
    datetime: string;
    project: string;
    metric: string;
}
