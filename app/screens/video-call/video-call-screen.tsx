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
let connectionBuffer

export const VideoCallScreen = observer(function VideoCallScreen() {
  const [stream, setStream] = React.useState(null)

  const route = useRoute<RouteProp<Record<string, VideoCallScreenParam>, string>>()
  const nameCall = route.params?.name

  const onRecieved = (data) => {
    console.log('on onRecieved', data)
    if (data?.candidate != null) {
      const candidateBuffer = new RTCIceCandidate(data)
      connectionBuffer.addIceCandidate(candidateBuffer)
    } else if (data?.type && data?.type === 'offer') {
      connectionBuffer.setRemoteDescription(data)
    } else if (data?.type && data?.type === 'answer') {
      connectionBuffer.setRemoteDescription(data)
    }
  }

  const onAnswerAccepted = async () => {
    console.log('on accept', connectionBuffer)

    connectionBuffer.createOffer().then(desc => {
      connectionBuffer.setLocalDescription(desc).then(() => {
        // Send pc.localDescription to peer
        console.log('on accept1111', desc, connectionBuffer.localDescription)
        emitSocket('call', JSON.stringify({ model: nameCall, dataStream: connectionBuffer.localDescription }))
      })
    })
    // connectionBuffer.onicecandidate = function (event) {
    //   // send event.candidate to peer
    //   console.log('in candicate:--', event)
    //   emitSocket('call', JSON.stringify({ model: nameCall, dataStream: event.candidate }))
    // }
    // const connectionBuffer = new RTCPeerConnection(config)
    // stream?.getTracks.forEach(track =>
    //   connectionBuffer.addTrack(track, stream),
    // )
    // const localDescription = await connectionBuffer.createOffer()
    //
    // await connectionBuffer.setLocalDescription(localDescription)
    //
    // emitSocket('call', JSON.stringify({ model: nameCall, dataStream: connectionBuffer.localDescription }))
    //
    // peerConnections.current.set(nameCall, connectionBuffer)
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
        console.log('in candicatewewewew-------', candidate)
        if (candidate) {
          emitSocket('call', JSON.stringify({ model: nameCall, dataStream: candidate }))
        }
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
      emitSocket('startAnswer', JSON.stringify({ call: nameCall, answer: deviceName }))
    } else {
      emitSocket('startCall', JSON.stringify({ call: deviceName, answer: nameCall }))
    }
    listenSocket('Received', onRecieved)
    listenSocket('onAnswerAccept', onAnswerAccepted)
    return stopStream
  }, [])

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
