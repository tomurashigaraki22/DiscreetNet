import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar, ImageBackground } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const navigation = useNavigation();

  const loginUser = async () => {
    setLoading(true);
    console.log("Logging in...");
    console.log(username);
    console.log(password);

    try {
      const response = await fetch(
        `http://192.168.43.228:5000/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      const responseData = await response.text(); // Read raw response as text
      console.log(response.status);

      console.log("Login response:", responseData);
      if (response.status === 200) {
        navigation.navigate("Home", { params1: username });
      } else {
        setShowPop(true); // Show user not found message
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toSignUp = () => {
    navigation.navigate("Signup");
  };

  return (
    <ImageBackground
      source={require("./Static/bg2.jpg")} // Replace with your background image
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <StatusBar hidden />
        <Text style={styles.header}>DiscreetNet</Text>
        <TextInput
          placeholder="Username"
          placeholderTextColor="white"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <View style={styles.passCont}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="white"
            secureTextEntry={showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)} // Toggle the showPassword state
            style={styles.eyeIconContainer}
          >
            {showPassword ? (
              <Ionicons name="eye-off" size={24} color="grey" />
            ) : (
              <Ionicons name="eye" size={24} color="grey" />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={loginUser}>
          {loading ? (
            <ActivityIndicator size="small" color="blue" /> // Show loading indicator while logging in
          ) : (
            <Text style={styles.loginButtonText}>Log In</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={toSignUp}>
          <Text style={styles.t1}>New User? Signup Here</Text>
        </TouchableOpacity>

        <View style={styles.anonymousTextContainer}>
          <Text style={styles.atText}>
            @<Text style={styles.anonymousText}>Anonymous</Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)", // Semi-transparent black background
    alignItems: "center",
    justifyContent: "center",
  },
  atText: {
    color: 'purple',
    fontSize: 24
  },
  passCont: {
    display: "flex",
    flexDirection: "row",
  },
  anonymousTextContainer: {
    position: "absolute",
    bottom: 20, // Adjust the bottom position as needed
    left: 0,
    right: 0,
    alignItems: "center",
  },
  anonymousText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "purple", // Add text shadow with purple color
    textShadowOffset: { width: 1, height: 1 }, // Adjust shadow offset as needed
    textShadowRadius: 5, // Adjust shadow radius as needed
  },
  eyeIconContainer: {
    position: "absolute",
    right: 20,
    top: 12,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Cover the entire screen with the background image
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white", // Change text color to white
    marginBottom: 40,
  },
  input: {
    height: 50,
    width: "80%",
    fontSize: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent white background
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: "white",
  },
  loginButton: {
    backgroundColor: "#0095f6",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  t1: {
    color: "white", // Change text color to white
    fontSize: 15,
    marginTop: 20,
  },
});

export default Login;
