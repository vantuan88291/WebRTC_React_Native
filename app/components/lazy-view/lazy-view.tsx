import * as React from "react"
import { ActivityIndicator, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../theme"

export interface ContainerProps {
  style?: ViewStyle
  children?: React.ReactNode
}
const ROOTVIEW: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: color.palette.white,
}
const LOADING: ViewStyle = {
  alignSelf: "center",
  marginVertical: 15,
}
/**
 * Describe your component here
 */
export const LazyView = observer(function Container(props: ContainerProps) {
  const { style, children, ...rest } = props
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    setLoading(false)
  }, [])
  if (loading) {
    return (
      <View style={ROOTVIEW}>
        <ActivityIndicator style={LOADING} size={"small"} color={color.primary} />
      </View>
    )
  }
  return (
    <View {...rest} style={style}>
      {children}
    </View>
  )
})
