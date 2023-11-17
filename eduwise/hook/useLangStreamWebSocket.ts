import { useCallback, useEffect, useRef, useState } from 'react'

export enum ConnectionType {
  Chat = 'chat'
}

export enum ReaderMode {
  Earliest = 'earliest',
  Latest = 'latest',
}

export interface ConnectionParams {
  baseUrl: string
  type: ConnectionType
  tenant: string
  appName: string
  gateway: string
  sessionId: number | string
  credentials?: string
  position?: ReaderMode
}

export interface WsMessage {
  id: number | string
  value: string
  yours: boolean
  gateway: string
  key?: string
  properties?: string
  headers?: number
}

interface CustomRecord {
  key: null | string;
  value: string;
  headers: Record<string, string>;
}

interface ConsumerMessage {
  record: CustomRecord;
  offset: string;
}

interface ParsedData {
  record: {
    value: string | null
    headers: { [key: string]: string }
  }
  offset: string
}

interface ConnectionDetails {
  connectionError: boolean
  hasTimedOut: boolean
  manuallyDisconnected: boolean
  isPaused: boolean
  isTopicReader: boolean
  lastMessageId?: number | string
}

const defaultConnectionDetails = {
  connectionError: false,
  hasTimedOut: false,
  isPaused: false,
  isTopicReader: false,
  manuallyDisconnected: false,
}

export const decodeWsMessage = (message: string) => {
  const base64Decoded = window.atob(message)
  let decoded
  try {
    decoded = decodeURIComponent(base64Decoded)
  } catch {
    return base64Decoded
  }
  return decoded
}

const makeWebsocketPath = ({
  baseUrl,
  tenant,
  appName,
  gateway,
  sessionId,
}: ConnectionParams) => {
  const url = `${baseUrl}/v1/${ConnectionType.Chat}/${tenant}/${appName}/${gateway}?param:sessionId=${sessionId}`
  return url.replace(/([^:]\/)\/+/g, "$1")
}


export const makeWebsocketUrl = (params: ConnectionParams) => {
  const url = new URL(makeWebsocketPath(params))
  if (params.credentials) {
    url.searchParams.append('credentials', params.credentials)
  }
  return url.toString()
}

const useWebSockets = () => {
  const [producerConnectionParams, setProducerConnectionParams] = useState<
    ConnectionParams | undefined
  >()
  const [consumerConnectionParams, setConsumerConnectionParams] = useState<
    ConnectionParams | undefined
  >()
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails>(
    defaultConnectionDetails
  )
  const consumerWs = useRef<WebSocket>()
  const producerWs = useRef<WebSocket>()
  const [messages, setMessages] = useState<string>()
  const [waitingForMessage, setWaitingForMessage] = useState<boolean>(false)
  const nextId = useRef<number>(1)

  useEffect(() => {
    nextId.current += 1
  }, [messages, nextId])

  const isConnected =
    consumerWs.current?.readyState === WebSocket.OPEN &&
    producerWs.current?.readyState === WebSocket.OPEN

  const connect = ({
    producer,
    consumer,
  }: {
    producer: ConnectionParams
    consumer: ConnectionParams
  }) => {
    setConnectionDetails(defaultConnectionDetails)
    setProducerConnectionParams(producer)
    setConsumerConnectionParams(consumer)
  }

  const connectConsumer = (
    consumer: ConnectionParams,
    topicReader?: boolean
  ) => {
    disconnectConsumer()
    setMessages("")
    if (topicReader) {
      setConnectionDetails({
        ...defaultConnectionDetails,
        isTopicReader: true,
      })
    }
    setConsumerConnectionParams(consumer)
  }

  const connectProducer = (producer: ConnectionParams) => {
    setProducerConnectionParams(producer)
  }

  const disconnectConsumer = useCallback(() => {
    consumerWs.current?.close()
  }, [])

  const disconnectProducer = useCallback(() => {
    producerWs.current?.close()
  }, [])

  const disconnect = (manual: boolean = false) => {
    if (manual) {
      setConnectionDetails(cd => {
        return { ...cd, manuallyDisconnected: true }
      })
    }
    disconnectConsumer()
    disconnectProducer()
    setMessages("")
  }

  // Setup connections
  useEffect(() => {
    if (!consumerConnectionParams) {
      return
    }
    if (consumerWs.current?.OPEN) {
      disconnectConsumer()
    }
    consumerWs.current = new WebSocket(
      makeWebsocketUrl(consumerConnectionParams)
    )
    consumerWs.current.onopen = () => {
      setConnectionDetails(cd => {
        return { ...cd, connectionError: false }
      })
    }
    consumerWs.current.onerror = e => {
      setConnectionDetails(cd => {
        return { ...cd, connectionError: true }
      })
      disconnect()
    }
    consumerWs.current.onclose = e => {
      if (!connectionDetails.manuallyDisconnected) {
        setConnectionDetails(cd => {
          return { ...cd, hasTimedOut: true }
        })
      }
    }
    consumerWs.current.onmessage = ({ data }) => {
      const parsedData: ParsedData = JSON.parse(data)
      const value: string | null = parsedData.record?.value
      const headers: { [key: string]: string } = parsedData.record?.headers
      const offset: string = parsedData?.offset


      if (consumerWs.current?.readyState === WebSocket.OPEN && value) {
        setMessages(value)
        setWaitingForMessage(false)
        consumerWs.current?.send(JSON.stringify({ offset }))
      } else {
        //Noop
      }
    }

    return disconnectConsumer
  }, [consumerConnectionParams, disconnectConsumer, disconnectProducer])

  useEffect(() => {
    if (!producerConnectionParams) {
      return
    }
    if (producerWs.current?.OPEN) {
      disconnectProducer()
    }
    producerWs.current = new WebSocket(
      makeWebsocketUrl(producerConnectionParams)
    )
    producerWs.current.onopen = () => {
      setConnectionDetails(cd => {
        return { ...cd, connectionError: false }
      })
    }
    producerWs.current.onerror = e => {
      setConnectionDetails(cd => {
        return { ...cd, connectionError: true }
      })
      disconnect()
    }
    producerWs.current.onclose = e => {
      if (!connectionDetails.manuallyDisconnected) {
        setConnectionDetails(cd => {
          return { ...cd, hasTimedOut: true }
        })
      }
    }
    producerWs.current.onmessage = e => {
      // noop
    }
    return disconnectProducer
  }, [producerConnectionParams, disconnectConsumer, disconnectProducer])

  const sendMessage = useCallback(
    (message: any) => {
      if (!producerConnectionParams) {
        return
      }
      if (producerWs.current?.readyState === WebSocket.OPEN) {
        setMessages(message)
        setWaitingForMessage(true)
        producerWs.current.send(JSON.stringify({ value: message }))
      } else {
        // noop
      }
    },
    [producerConnectionParams]
  )

  return {
    connect,
    connectConsumer,
    connectProducer,
    connectionError: connectionDetails.connectionError,
    disconnect,
    hasTimedOut: connectionDetails.hasTimedOut,
    isConnected,
    isPaused: connectionDetails.isPaused,
    messages,
    sendMessage,
    waitingForMessage
  }
}

export default useWebSockets