import * as React from "react"
import { Text as ReactNativeText } from "react-native"
import { presets } from "./text.presets"
import { TextProps } from "./text.props"
import { translate } from "../../i18n"
import { mergeAll, flatten } from "ramda"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Text(props: TextProps) {
  // grab the props
  const {
    preset = "default",
    tx,
    txOptions,
    text,
    children,
    style: styleOverride,
    size,
    color,
    ...rest
  } = props

  // figure out which content to use
  const i18nText = tx && translate(tx, txOptions)
  let content = null
  if (i18nText != null) {
    content = i18nText
  }
  if (text != null) {
    content = text.toString()
  }
  if (children != null) {
    content = children
  }
  const style = mergeAll(
    flatten([
      presets[preset] || presets.default,
      styleOverride,
      color && { color: props.color },
      size && { fontSize: size },
    ]),
  )
  return (
    <ReactNativeText {...rest} style={style}>
      {content}
    </ReactNativeText>
  )
}
