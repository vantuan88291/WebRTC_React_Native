import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, ActivityIndicator, View } from "react-native"
import { Button, Icon, Screen } from "../../components"
import { color, commonStyle } from "../../theme"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { deviceName, emitSocket, listenSocket, removeListenSocket } from "../../utils/utils"
import {
  RTCView,
  RTCPeerConnection,
  RTCIceCandidate,
  mediaDevices,
  RTCSessionDescription
} from 'react-native-webrtc'
import common from "../../utils/common"
import { RootNavigation } from "../../navigation"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}
const LOCAL: ViewStyle = {
  flex: 1,
  display: 'flex',
  backgroundColor: 'black',
}
const REMOTE: ViewStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: color.transparent
}
const REMOTE_VIEW: ViewStyle = {
  width: 150,
  height: 200,
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: 'white',
  zIndex: 10,
  alignItems: 'center',
  justifyContent: 'center'
}
const BTN_END: ViewStyle = {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: color.background,
  position: 'absolute',
  bottom: 0,
  left: 20,
  alignItems: 'center',
  justifyContent: 'center',
  ...commonStyle.SHADOW
}
type VideoCallScreenParam = {
  isAnswer?: boolean
  name: string
}
const config = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302'],
    },
  ],
}
const isFront = true
let connectionBuffer

export const VideoCallScreen = observer(function VideoCallScreen() {
  const [stream, setStream] = React.useState(null)
  const [remote, setRemote] = React.useState(null)
  const navigation = useNavigation()

  const route = useRoute<RouteProp<Record<string, VideoCallScreenParam>, string>>()
  const nameCall = route.params?.name

  const onEndCall = () => {
    stopStream()
    RootNavigation.goBack()
  }

  const onRecieved = (data) => {
    console.log('on onRecieved', data)
    try {
      if (data?.type && data?.type === common.TRIGGER.offer) {
        if (connectionBuffer?.setRemoteDescription != null) {
          connectionBuffer.setRemoteDescription(new RTCSessionDescription(data))
          connectionBuffer.createAnswer().then(desc => {
            connectionBuffer.setLocalDescription(desc).then(() => {
              emitSocket(common.EVENT.call, JSON.stringify({ model: nameCall, dataStream: connectionBuffer.localDescription }))
            })
          })
        }
      } else if (data?.type && data?.type === common.TRIGGER.answer) {
        if (connectionBuffer?.setRemoteDescription != null) {
          connectionBuffer.setRemoteDescription(new RTCSessionDescription(data))
        }
      } else if (data?.candidate != null && connectionBuffer?.addIceCandidate != null) {
        const candidateBuffer = new RTCIceCandidate(data)
        connectionBuffer.addIceCandidate(candidateBuffer)
      }
    } catch (e) {
      onEndCall()
    }
  }
  const onAnswerAccepted = async () => {
    console.log('on accept')
    connectionBuffer.createOffer().then(desc => {
      connectionBuffer.setLocalDescription(desc).then(() => {
        emitSocket(common.EVENT.call, JSON.stringify({ model: nameCall, dataStream: connectionBuffer.localDescription }))
      })
    })
  }

  const setUpVideo = async () => {
    if (!stream) {
      const s = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500,
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode: (isFront ? "user" : "environment")
        }
      })
      setStream(s)
      connectionBuffer = new RTCPeerConnection(config)
      connectionBuffer.addStream(s)
      connectionBuffer.onicecandidate = function ({ candidate }) {
        if (candidate) {
          emitSocket(common.EVENT.call, JSON.stringify({ model: nameCall, dataStream: candidate }))
        }
      }
      connectionBuffer.onaddstream = function (remote) {
        setRemote(remote?.stream)
      }
    }
  }

  const stopStream = (isExit = true) => {
    if (isExit) {
      emitSocket(common.EVENT.endCall, nameCall)
    }
    if (stream) {
      stream.release()
      setStream(null)
    }
    if (remote) {
      remote.release()
      setRemote(null)
    }
    if (connectionBuffer) {
      connectionBuffer.close()
    }
    removeListenSocket(common.EVENT.Received, onRecieved)
    removeListenSocket(common.EVENT.onAnswerAccept, onAnswerAccepted)
    removeListenSocket(common.EVENT.onEndCall, onEndCallFromPeer)
  }
  const onEndCallFromPeer = () => {
    console.log('on end call')
    stopStream(false)
    navigation.goBack()
  }
  React.useEffect(() => {
    setUpVideo()
    if (route.params?.isAnswer) {
      emitSocket(common.EVENT.startAnswer, JSON.stringify({ call: nameCall, answer: deviceName }))
    } else {
      emitSocket(common.EVENT.startCall, JSON.stringify({ call: deviceName, answer: nameCall }))
    }
    listenSocket(common.EVENT.Received, onRecieved)
    listenSocket(common.EVENT.onAnswerAccept, onAnswerAccepted)
    listenSocket(common.EVENT.onEndCall, onEndCallFromPeer)

    return stopStream
  }, [])

  return (
    <Screen style={ROOT} preset="fixed">
      <RTCView streamURL={stream?.toURL()} style={LOCAL} />
      <View style={REMOTE_VIEW}>
        <ActivityIndicator color={color.error}/>
        <RTCView streamURL={remote?.toURL()} style={REMOTE} />
      </View>
      <Button onPress={onEndCall} style={BTN_END} preset="normal">
        <Icon size={40} icon="end" />
      </Button>
    </Screen>
  )
})
