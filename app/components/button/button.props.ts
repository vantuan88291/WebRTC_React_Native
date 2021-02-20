import { ViewStyle, TextStyle, TouchableOpacityProps } from "react-native"
import { ButtonPresetNames } from "./button.presets"
export const scales = {
  small: 0.98,
  large: 0.9,
}
type ScaleType = keyof typeof scales

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle | ViewStyle[]

  /**
   * An optional style override useful for the button text.
   */
  textStyle?: TextStyle | TextStyle[]

  /**
   * One of the different types of text presets.
   */
  preset?: ButtonPresetNames

  /**
   * One of the different types of text presets.
   */
  children?: React.ReactNode

  color?: string
  textColor?: string
  iconColor?: string
  loading?: boolean
  size?: number
  scale?: ScaleType
}
