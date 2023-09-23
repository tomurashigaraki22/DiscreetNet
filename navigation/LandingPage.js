import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

function LandingPage() {
  const navigation = useNavigation();

  const navigateToSignIn = () => {
    navigation.navigate("Login"); // Replace "Login" with your actual screen name for signing in
  };

  const navigateToRegister = () => {
    navigation.navigate("Signup"); // Replace "Signup" with your actual screen name for registration
  };

  return (
    <ImageBackground
      source={require("./Static/bg5.jpg")} // Replace with your background image
      style={styles.backgroundImage}
    >
        <StatusBar hidden />
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to</Text>
        <Text style={styles.appName}>DiscreetNet</Text>
        <Text style={styles.description}>
          Connect with others anonymously and share your thoughts without revealing your identity. DiscreetNet is the perfect platform to express yourself freely.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={navigateToSignIn}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={navigateToRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent black background
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Cover the entire screen with the background image
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    textAlign: "center",
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#0095f6",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "white",
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "80%",
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    backgroundColor: "#0095f6",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LandingPage;
