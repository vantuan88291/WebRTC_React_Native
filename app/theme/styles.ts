import { TextStyle, ViewStyle } from "react-native"
import { color } from "."

export const commonStyle = {
  CENTER: {
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  TEXT_CENTER: {
    textAlign: "center",
  } as TextStyle,
  FLEX: {
    flex: 1,
  } as ViewStyle,
  ROW: {
    flexDirection: "row",
  } as ViewStyle,
  SHADOW: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  } as ViewStyle,
  LIGHT_SHADOW: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  } as ViewStyle,
  DARK_SHADOW: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  } as ViewStyle,
  LOADING: {
    padding: 15,
  } as ViewStyle,
  ROOT: {
    flex: 1,
    backgroundColor: color.background,
  } as ViewStyle,
  SEPARATOR: {
    borderWidth: 0.5,
    borderColor: color.line,
  } as ViewStyle,
}
