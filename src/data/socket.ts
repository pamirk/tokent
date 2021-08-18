import io from "socket.io-client"

export const socket = io(`https://api.tokenterminal.com/`, {
  auth: { token: `auth token` },
  transports: ["websocket", "polling"],
})

export type PriceDataType = { [key: string]: { usd?: number; eur?: number } }
