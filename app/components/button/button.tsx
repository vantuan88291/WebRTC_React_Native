import * as React from "react"
import { viewPresets, textPresets } from "./button.presets"
import { ButtonProps, scales } from "./button.props"
import { mergeAll, flatten } from "ramda"
import { ActivityIndicator, Animated, TouchableWithoutFeedback } from "react-native"
import { Text } from ".."
import { color as colorText } from "../../theme"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const {
    preset = "primary",
    tx,
    text,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    color,
    textColor,
    loading,
    size,
    scale,
    ...rest
  } = props
  const animation = new Animated.Value(0)
  const inputRange = [0, 1]
  const outputRange = [1, scales[scale ?? "large"]]
  const scaleType = animation.interpolate({ inputRange, outputRange })

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }
  const onPressOut = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start()
  }

  const viewStyle = React.useMemo(
    () =>
      mergeAll(
        flatten([
          viewPresets[preset] || viewPresets.primary,
          styleOverride,
          color && { backgroundColor: color },
        ]),
      ),
    [styleOverride, preset, color],
  )
  const textStyle = mergeAll(
    flatten([textPresets[preset] || textPresets.primary, textStyleOverride]),
  )

  const content = children || (
    <Text
      tx={tx}
      text={text}
      style={textStyle}
      size={size}
      color={textColor ?? colorText.palette.white}
      numberOfLines={1}
    />
  )
  return (
    <TouchableWithoutFeedback
      style={viewStyle}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={loading}
      {...rest}
    >
      <Animated.View
        style={{
          transform: [
            {
              scale: scaleType,
            },
          ],
          ...viewStyle,
        }}
      >
        {loading ? <ActivityIndicator color={"#c5d2db"} /> : content}
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}
