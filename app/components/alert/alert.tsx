import * as React from "react"
import { observer } from "mobx-react-lite"
import DropdownAlert from "react-native-dropdownalert"
import { useStores } from "../../models"
import common from "../../utils/common";
import {color} from "../../theme";
import {ImageStyle} from "react-native";
import {icons} from "../icon/icons";

export interface AlertProps {}
/**
 * Describe your component here
 */
const IMG: ImageStyle = {
  tintColor: color.palette.white,
  alignSelf: "center",
  width: 28,
  height: 28,
  resizeMode: 'contain'
}

export const Alert = observer(function Alert(props: AlertProps) {
  const ref = React.useRef(null)
  const { commons } = useStores()

  React.useEffect(() => {
    if (commons.alert.message !== "") {
      // eslint-disable-next-line no-unused-expressions
      ref.current?.alertWithType(commons.alert.type, commons.alert.title, commons.alert.message)
    }
  }, [commons.alert.message])
  const onClose = () => {
    commons.resetAlert()
  }
  const onAlertTapped = ({type, title, message, action, payload, interval}) => {
    if (commons.alert.type === common.ALERT.info) {
      try {
        const data = JSON.parse(payload)
        onClose()
      } catch (e) {
        onClose()
      }
    }
  }
  return (
    <DropdownAlert
      onClose={onClose}
      updateStatusBar={false}
      inactiveStatusBarStyle={"light-content"}
      onTap={onAlertTapped}
      infoColor={color.primary}
      infoImageSrc={icons.bell}
      imageStyle={IMG}
      ref={ref}
    />
  )
})
