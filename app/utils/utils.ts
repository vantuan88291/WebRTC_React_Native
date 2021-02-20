
let socket: any = null

export function setSocket(mSocket: any) {
  socket = mSocket
  console.log('connected')
}
export function listenSocket(name: string, func: (data?: any) => void) {
  socket.on(name, func)
}
export function emitSocket(name: string, value?: any) {
  socket.emit(name, value)
}
export function disConnectSocket() {
  console.log('disconect')
  socket.disconnect()
}
