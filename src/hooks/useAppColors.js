import { useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";

const ENABLE_DARK_MODE = false;

export function useAppColors() {
  const colorScheme = useColorScheme();

  return ENABLE_DARK_MODE && colorScheme === "dark"
    ? Colors.dark
    : Colors.light;
}
