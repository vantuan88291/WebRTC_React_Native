import { Platform } from "react-native"
import DeviceInfo from "react-native-device-info"

let socket: any = null

/**
 * @function set socket value
 * @param mSocket
 */
export function setSocket(mSocket: any) {
  socket = mSocket
  console.log('connected')
}

/**
 * @function listent an event
 * @param name of event
 * @param func => callback to get data
 */
export function listenSocket(name: string, func: (data?: any) => void) {
  socket?.on(name, func)
}

/**
 * @function emit an event
 * @param name of event
 * @param value of event
 */
export function emitSocket(name: string, value?: any) {
  socket?.emit(name, value)
}

/**
 * @function disconnect socket if needed
 */

export function disConnectSocket() {
  console.log('disconect')
  socket?.disconnect()
}

/**
 * @function remove listener of socket event
 * @param eventName
 * @param callback
 */
export function removeListenSocket(eventName: string, callback: any) {
  socket?.removeListener(eventName, callback)
}

export const isIos = Platform.OS === "ios"

export const deviceName = DeviceInfo.getModel()

/**
 * @function
 * @return true / false
 * @method check if iphone x to iphone 13
 */
export const isIphonex = () => {
  const isTrue = false
  if (!isIos) {
    return isTrue
  }
  const name = DeviceInfo.getModel()
  const list = ["iPhone X", "iPhone 11", "iPhone 12", "iPhone 13"]
  if (list.some((item) => name.includes(item))) {
    return true
  }
  return isTrue
}

/**
 * @function log of reactotron
 * @return void
 * @param key
 * @param value
 */
export const log = (key, value) => {
  if (__DEV__) {
    console.tron.display({
      name: key,
      value: value,
      important: true,
    })
  }
}
