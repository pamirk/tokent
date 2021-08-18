import { socket } from "data/socket"
import React, { useEffect, useState } from "react"
type SocketContextType = {
  priceMap: { [key: string]: { usd?: number; eur?: number } }
}

export const SocketContext = React.createContext<SocketContextType>({
  priceMap: {},
})

export const useSocket = () => React.useContext(SocketContext)

export const SocketProvider = ({ children }: any) => {
  const [priceMap, setPriceMap] = useState<{
    [key: string]: { usd?: number; eur?: number }
  }>({})

  useEffect(() => {
    socket.on("pricedata", setPriceMap)

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider
      value={{
        priceMap,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
