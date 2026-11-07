import { useRouter  } from "expo-router";
import { View, StyleSheet, TextInput, Text } from "react-native";
import ThemedView from "../../components/ThemedView";
import AppButton from "../../components/AppButton";
import ThemedText from "@/components/ThemedText";
import{Colors} from "../../constants/Colors";


export default function Login() {
    const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      {/* <Image source={require("../../../assets/app-images/innlogging.png")} style={styles.image} /> */}
      <View style={styles.overlay} />
      <ThemedText style={styles.title}>Log in to begin </ThemedText>

      <TextInput placeholder="username" placeholderTextColor={Colors.light.text} style={styles.input} />
      <TextInput placeholder="password" placeholderTextColor={Colors.light.text} secureTextEntry style={styles.input} />
      <AppButton 
        style={styles.button}
        title="Log in" 
        onPress={() => router.push("/profile")} 
      />
      <ThemedText style={styles.forgotPassword}>Forgot your password?<Text style={{color: Colors.light.text, fontWeight: "bold"}}> Press here</Text></ThemedText>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.light.inputBackground,
    height: 40,
    borderColor: "white",
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    borderWidth: 2,
    marginBottom: 10,
    width: "60%",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
    width: "60%",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  forgotPassword: {
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
  },
});


