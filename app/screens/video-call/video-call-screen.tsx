import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { RouteProp, useRoute } from "@react-navigation/native"
import { deviceName, emitSocket, listenSocket } from "../../utils/utils"
import {
  RTCView,
  RTCPeerConnection,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc'

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
export const VideoCallScreen = observer(function VideoCallScreen() {
  const [stream, setStream] = React.useState(null)
  const peerConnections = React.useRef(new Map())

  const route = useRoute<RouteProp<Record<string, VideoCallScreenParam>, string>>()
  const nameCall = route.params?.name

  const onRecieved = (data) => {
    console.log('on onRecieved', data, peerConnections.current)
    const connectionBuffer = peerConnections.current.get(nameCall)
    connectionBuffer.setRemoteDescription(data)
  }

  const onAnswerAccepted = async () => {
    console.log('on accept')
    const connectionBuffer = new RTCPeerConnection(config)
    stream?.getTracks.forEach(track =>
      connectionBuffer.addTrack(track, stream),
    )
    const localDescription = await connectionBuffer.createOffer()

    await connectionBuffer.setLocalDescription(localDescription)

    emitSocket('call', JSON.stringify({ model: nameCall, dataStream: connectionBuffer.localDescription }))

    peerConnections.current.set(nameCall, connectionBuffer)
  }

  const setUpVideo = async () => {
    if (!stream) {
      try {
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
        console.log('on setsStream', s)

        setStream(s)
      } catch (e) {
        console.log('eeee', e)
      }
    }
  }

  const stopStream = () => {
    if (stream) {
      console.log('stop===')
      stream.release()
      setStream(null)
    }
  }

  React.useEffect(() => {
    if (route.params?.isAnswer) {
      emitSocket('startAnswer', JSON.stringify({ call: nameCall, answer: deviceName }))
    } else {
      emitSocket('startCall', JSON.stringify({ call: deviceName, answer: nameCall }))
    }
    listenSocket('Received', onRecieved)
    listenSocket('onAnswerAccept', onAnswerAccepted)
    setUpVideo()
    return stopStream
  }, [])

  console.log('in strw====', stream)
  return (
    <Screen style={ROOT} preset="fixed">
      <RTCView streamURL={stream?.toURL()} style={{
        flex: 1,
        display: 'flex',
        backgroundColor: '#4F4',
      }} />
    </Screen>
  )
})
