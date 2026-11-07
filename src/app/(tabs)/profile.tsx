//import { Link } from "expo-router";
import { View, StyleSheet, Image, } from "react-native";
import AppButton from "../../components/AppButton";
import ThemedText from "../../components/ThemedText";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import ThemedView from "../../components/ThemedView";

export default function Profile() {
    const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Image source={require("../../../assets/app-images/profil-rom.png")} style={styles.background} />
      <View style={styles.overlay} />
      <Image source={require("../../../assets/app-images/profile.png")} style={styles.image} />
     
      <View style={styles.topCard}>
          <View style={[styles.card]}>
            <ThemedText style={styles.subtitle}> 1 </ThemedText>
            <ThemedText style={styles.label}> Completed </ThemedText>
          </View>

          <View style={[styles.card]}>
            <ThemedText style={styles.subtitle}> 2 </ThemedText>
            <ThemedText style={styles.label}> Created </ThemedText>
          </View>

          <View style={[styles.card]}>
            <ThemedText style={styles.subtitle}> 200 </ThemedText>
            <ThemedText style={styles.label}> Points </ThemedText>
          </View>
          
          <View style={[styles.card]}>
            <ThemedText style={styles.subtitle}> 2 </ThemedText>
            <ThemedText style={styles.label}> Friends </ThemedText>
          </View>
    </View> 
    {/* topCard end */}

      <AppButton 
      style={styles.button}
       title="Log Out" 
       onPress={() => router.push("/login")} 
       />

    </ThemedView>
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
    color: Colors.light.text,
  },
  label: {
    fontSize: 13,
    textAlign: "center",
    color: Colors.light.mutedText,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.light.text,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.light.iconColorFocused,
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  button:{
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    width: "20%",
    
  },
  topCard: {
    display: "flex", 
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  }
});


