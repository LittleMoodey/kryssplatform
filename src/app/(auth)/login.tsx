import { useRouter  } from "expo-router";
import { Text, View, StyleSheet, TextInput, Image, Pressable } from "react-native";


export default function Login() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      {/* <Image source={require("../../../assets/app-images/innlogging.png")} style={styles.image} /> */}
      <View style={styles.overlay} />
      <Text style={styles.title}>Log in to begin </Text>

      <TextInput placeholder="username" placeholderTextColor="rgba(105, 75, 132, 0.91)" style={styles.input} />
      <TextInput placeholder="password" placeholderTextColor="rgba(105, 75, 132, 0.91)" secureTextEntry style={styles.input} />
      <Pressable style={styles.button} onPress={() => router.push("/profile")}>
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    color: "#a85ef7",
  },
  input: {
  height: 40,
  borderColor: "white",
  fontSize: 15,
  fontWeight: "bold",
  color: "white",
  textAlign: "center",
  borderWidth: 2,
  marginBottom: 10,
  width: "80%",
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
    backgroundColor: "#a85ef7",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(243, 233, 233, 0.5)",
  },
});


