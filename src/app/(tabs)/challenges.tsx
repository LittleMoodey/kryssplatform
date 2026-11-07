import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import ChallengeCard from "../../components/ChallengeCard";
import { StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { challengesdata } from "../../data/mochdata";

export default function Challenges() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

      <ThemedText title style={styles.heading}>Challenges</ThemedText>

      {challengesdata.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          status={challenge.status}
          onPress={() =>
            router.push({ pathname: "/map", params: { id: challenge.id } })
          }
        />
      ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    gap: 16,
  },
  content: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
  },
});