import { Link } from "expo-router";
import { Text, View, StyleSheet, Button, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
    const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../../../assets/app-images/profil-rom.png")} style={styles.background} />
      <View style={styles.overlay} />
      <Image source={require("../../../assets/app-images/profile.png")} style={styles.image} />
      <Text style={styles.title}>Your profile</Text>
      <Text style={styles.subtitle}>This is where you can manage your profile settings and view your activity.</Text>

      <Pressable style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.buttonText}>Log Out</Text>
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
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    color: "#b546f1",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#b546f1",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#c77eee",
    marginBottom: 20,
  },
  background: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "130%",
  height: "100%",
  resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#a85ef7",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});


