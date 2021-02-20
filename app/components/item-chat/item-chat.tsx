import * as React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../theme"
import { Button, Text } from "../"
import MenuMaterial from "../material-menu/menu-material"
import { DataChatProps } from "../../models/chat/chat.props"

const CONTAINER: ViewStyle = {
  padding: 10,
  alignSelf: 'flex-start'
}
const CONTAINER_SELF: ViewStyle = {
  padding: 10,
  alignSelf: 'flex-end'
}
const CONTENT: ViewStyle = {
  backgroundColor: color.palette.blueLight,
  padding: 10,
  borderRadius: 9,
  alignSelf: 'flex-start'
}
const CONTENT_SELF: ViewStyle = {
  backgroundColor: color.palette.blue,
  padding: 10,
  borderRadius: 9,
  alignSelf: 'flex-end'
}
const NAME: TextStyle = {
  fontWeight: 'bold',
  fontSize: 15,
  color: color.palette.blueMidNight
}
const MENU: ViewStyle = {
  marginTop: -10,
}
const WRAPPER: ViewStyle = {
  backgroundColor: color.background,
  borderRadius: 8,
}
export interface ItemChatProps {
    item: DataChatProps
}

/**
 * Describe your component here
 */
export const ItemChat = observer(function ItemChat(props: ItemChatProps) {
  const { item } = props
  const ref = React.useRef(null)

  const renderOption = (
      <MenuMaterial style={MENU} ref={ref}>
        <View style={WRAPPER}>
         <Button tx={'chat.videoCall'}/>
        </View>
      </MenuMaterial>
  )
  const showOption = () => ref.current?.show()
  // if (item?.id === 3) {
  //   return (
  //           <Button onPress={showOption} preset="normal" style={CONTAINER_SELF}>
  //               <View style={CONTENT_SELF}>
  //                   <Text color={color.background} text={item.message}/>
  //               </View>
  //               {renderOption}
  //           </Button>
  //   )
  // }
  return (
    <Button onPress={showOption} preset="normal" style={CONTAINER}>
      <Text style={NAME} text={item.name}/>
      <View style={CONTENT}>
        <Text text={item.message}/>
      </View>
      {renderOption}
    </Button>
  )
})
