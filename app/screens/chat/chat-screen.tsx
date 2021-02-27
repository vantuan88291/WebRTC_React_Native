import React from "react"
import { observer } from "mobx-react-lite"
import { FlatList, ListRenderItem, TextStyle, ViewStyle } from "react-native"
import { Button, Header, Icon, ItemChat, Row, Screen, TextField } from "../../components"
import { color } from "../../theme"
import { useStores } from "../../models"
import { DataChatProps } from "../../models/chat/chat.props"
import { useNavigation } from "@react-navigation/native"
import { isIos, isIphonex } from "../../utils/utils"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
}
const INPUT_CONTAINER: ViewStyle = {
  paddingVertical: 0,
  flex: 1
}
const INPUT_STYLE: TextStyle = {
  backgroundColor: color.line,
  paddingHorizontal: 10,
  paddingVertical: isIos ? (isIphonex() ? 20 : 10) : 5,
  color: color.text,
  maxHeight: 80
}
const BTN_SEND: TextStyle = {
  paddingHorizontal: 15,
  paddingVertical: 5
}
const ROW_INPUT: ViewStyle = {
    marginBottom: isIphonex() ? 15 : 0
}

export const ChatScreen = observer(function ChatScreen() {
  const { chat } = useStores()
  const scroll = React.useRef(null)
  const navigation = useNavigation()

  const moveToCall = (item: DataChatProps) => {
    navigation.navigate('call', { name: item.name, isAnswer: false })
  }
  React.useEffect(() => {
    scroll.current?.scrollToEnd({ animated: true })
  }, [chat.data.length])
  const renderItem: ListRenderItem<DataChatProps> = ({ item, index }) => <ItemChat moveToCall={moveToCall} item={item} />
  return (
    <Screen style={ROOT} preset="fixed">
      <Header headerTx={'chat.title'} />
      <FlatList
          ref={scroll}
          removeClippedSubviews
          initialNumToRender={20}
          extraData={chat.data.length}
          keyExtractor={(item, index) => index + 'chat'}
          data={chat.data}
          renderItem={renderItem} />
          <Row style={ROW_INPUT}>
              <TextField
                  value={chat.msg}
                  onChangeText={chat.setMsg}
                  multiline
                  style={INPUT_CONTAINER}
                  inputStyle={INPUT_STYLE}
                  placeholderTextColor={color.palette.lightGrey}
                  placeholderTx={'chat.hint'}
              />
              <Button onPress={chat.onSendMsg} style={BTN_SEND} preset="icon">
                  <Icon size={30} icon="send" />
              </Button>
          </Row>
    </Screen>
  )
})
