import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { useRouter} from "expo-router";

export default function Index() {
const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/app-images/ChallengeApp.png")} style={styles.image} />
  <View style={styles.spacer} />
      <View style={styles.spacer} />
      <View style={styles.spacer} />
      <View style={styles.spacer} />
      <Image source={require("../../assets/app-images/pionter.png")} style={styles.imagelogo} />
      <Text style={styles.title}>Welcome to the Challenge Resolver!</Text>
      <View style={styles.spacer} />

        <Pressable style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.buttonText}>Log in here!</Text>
        </Pressable>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    color: "#eccaff",
    textShadowColor: "rgba(0, 0, 0, 0.88)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  image: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "120%",
  height: "100%",
  resizeMode: "cover",
},
  button: {
    backgroundColor: "#b578f6cf",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  spacer: {
    flex: 1,
  },
  imagelogo: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderColor: "#c77eee",
    marginBottom: 20,
  },
});


