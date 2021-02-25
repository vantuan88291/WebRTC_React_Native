import * as React from "react"
import { observer } from "mobx-react-lite"
import { AppState } from "react-native"
import {
  deviceName,
  disConnectSocket,
  emitSocket,
  isIos,
  listenSocket,
  setSocket
} from "../../utils/utils"
import {io} from "socket.io-client"
import common from "../../utils/common"
import { useStores } from "../../models"
import { DataChatProps } from "../../models/chat/chat.props"
import { translate } from "../../i18n"

export interface SocketProps {
}
/**
 * Describe your component here
 */
export const Socket = observer(function Socket(props: SocketProps) {
  const { chat, commons } = useStores()
  const handleChange = (state) => {
    if (state === 'active') {
      setupSocket()
    } else {
      disConnectSocket()
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
  const inComingCall = (call: string) => {
    commons.push(translate('chat.inComming', { name: call }), null, call)
  }
  const onEndCall = () => {
    console.log('on end call from socket')
    commons.resetAlert()
  }
  const setupSocket = () => {
    setSocket(io(common.BASE_SOCKET, {
      reconnectionDelayMax: 10000,
      query: {
        model: deviceName
      }
    }))
    listenSocket(common.EVENT.newmsg, onNewMsg)
    listenSocket(common.EVENT.allData, onGetAllMsg)
    listenSocket(common.EVENT.isTyping, isTyping)
    listenSocket(common.EVENT.inComing, inComingCall)
    listenSocket(common.EVENT.onEndCall, onEndCall)
    emitSocket(common.EVENT.getAllData)
  }
  React.useEffect(() => {
    if (isIos) {
      setupSocket()
    }
    AppState.addEventListener('change', handleChange)
    return () => {
      disConnectSocket()
      AppState.removeEventListener('change', handleChange)
    }
  }, [])
  return <></>
})
