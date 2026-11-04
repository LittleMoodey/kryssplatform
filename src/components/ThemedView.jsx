import { View } from "react-native";
import { useAppColors } from "../hooks/useAppColors";

const ThemedView = ({ style, children, ...props }) => {
  const theme = useAppColors();

  return (
    <View style={[{ backgroundColor: theme.background }, style]} {...props}>
      {children}
    </View>
  );
};

export default ThemedView;
