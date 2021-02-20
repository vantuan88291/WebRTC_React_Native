import * as React from "react"
import { View, ViewStyle } from "react-native"
import { flatten, mergeAll } from "ramda"

const CONTAINER: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

export interface RowProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle | ViewStyle[]
  children: Element
}

/**
 * Describe your component here
 */
export function Row(props: RowProps) {
  const { style: styleOverride, children, ...rest } = props
  const viewStyle = mergeAll(flatten([CONTAINER, styleOverride]))

  return (
    <View style={viewStyle} {...rest}>
      {children}
    </View>
  )
}
