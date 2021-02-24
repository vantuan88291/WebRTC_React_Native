import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { Screen } from "../../components"
import { color } from "../../theme"
import { RouteProp, useRoute } from "@react-navigation/native"
import { deviceName, emitSocket, listenSocket } from "../../utils/utils"
import {
  RTCView,
  RTCPeerConnection,
  RTCIceCandidate,
  mediaDevices,
  RTCSessionDescription
} from 'react-native-webrtc'
import common from "../../utils/common";

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
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

  const route = useRoute<RouteProp<Record<string, VideoCallScreenParam>, string>>()
  const nameCall = route.params?.name

  const onRecieved = (data) => {
    console.log('on onRecieved', data)
    if (data?.candidate != null && connectionBuffer.addIceCandidate != null) {
      const candidateBuffer = new RTCIceCandidate(data)
      connectionBuffer.addIceCandidate(candidateBuffer)
    } else if (data?.type && data?.type === 'offer') {
      connectionBuffer.setRemoteDescription(new RTCSessionDescription(data))
      connectionBuffer.createAnswer().then(desc => {
        connectionBuffer.setLocalDescription(desc).then(() => {
          emitSocket(common.EVENT.call, JSON.stringify({ model: nameCall, dataStream: connectionBuffer.localDescription }))
        })
      })
    } else if (data?.type && data?.type === 'answer') {
      connectionBuffer.setRemoteDescription(new RTCSessionDescription(data))
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

  const stopStream = () => {
    if (stream) {
      stream.release()
      setStream(null)
    }
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
    return stopStream
  }, [])

  return (
    <Screen style={ROOT} preset="fixed">
      <RTCView streamURL={stream?.toURL()} style={{
        flex: 1,
        display: 'flex',
        backgroundColor: '#4F4',
      }} />
      <RTCView streamURL={remote?.toURL()} style={{
        width: 200,
        height: 200,
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'red',
      }} />
    </Screen>
  )
})
