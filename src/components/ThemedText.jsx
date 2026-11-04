import { Text } from "react-native";
import { useAppColors } from "../hooks/useAppColors";

const ThemedText = ({
  style,
  title = false,
  muted = false,
  children,
  ...props
}) => {
  const theme = useAppColors();

  const textColor = title ? theme.title : muted ? theme.mutedText : theme.text;

  return (
    <Text style={[{ color: textColor }, style]} {...props}>
      {children}
    </Text>
  );
};

export default ThemedText;
