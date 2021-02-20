import * as React from "react"
import { observer } from "mobx-react-lite"
import { AppState } from "react-native"
import { disConnectSocket, emitSocket, listenSocket, setSocket } from "../../utils/utils"
import io from "socket.io-client"
import common from "../../utils/common"
import { useStores } from "../../models"
import { DataChatProps } from "../../models/chat/chat.props"

export interface SocketProps {
}

/**
 * Describe your component here
 */
export const Socket = observer(function Socket(props: SocketProps) {
  const { chat } = useStores()
  const handleChange = (state) => {
    if (state === 'active') {
      setupSocket()
    }
  }
  const onNewMsg = (data: DataChatProps) => {
    chat.pushMsg(data)
  }
  const onGetAllMsg = (data: DataChatProps[]) => {
    chat.setData(data)
  }
  const isTyping = (data) => {

  }
  const setupSocket = () => {
    setSocket(io(common.BASE_SOCKET, {
      reconnectionDelayMax: 10000,
      query: {
        model: "my phone"
      }
    }))
    listenSocket('newmsg', onNewMsg)
    listenSocket('allData', onGetAllMsg)
    listenSocket('isTyping', isTyping)
    emitSocket('getAllData')
  }
  React.useEffect(() => {
    setupSocket()
    AppState.addEventListener('change', handleChange)
    return () => {
      disConnectSocket()
      AppState.removeEventListener('change', handleChange)
    }
  }, [])
  return <></>
})
