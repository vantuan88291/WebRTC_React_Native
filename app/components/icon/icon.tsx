import * as React from "react"
import { View, Image, ImageStyle } from "react-native"
import { IconProps } from "./icon.props"
import { icons } from "./icons"

const ROOT: ImageStyle = {
  resizeMode: "contain",
}

export function Icon(props: IconProps) {
  const { style: styleOverride, icon, containerStyle, size, color } = props
  const iconStyle = {
    ...ROOT,
    width: size,
    height: size,
  }
  const mergeStyle = size ? iconStyle : ROOT
  const style: ImageStyle = { ...mergeStyle, ...styleOverride }
  const tinColor = {
    tintColor: color,
  }
  return (
      <View style={containerStyle}>
        <Image style={[style, color != null && tinColor]} source={icons[icon]} />
      </View>
  )
}
