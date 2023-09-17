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


function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignup = async () => {
    setLoading(true);
    try {
      console.log("Signing up...");
      console.log(username);
      console.log(password);
      const response = await fetch(`https://discreetnetsv.onrender.com/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const responseData = await response.text(); // Read raw response as text

      console.log("Signup response:", responseData);

      if (response.status === 200) {
        navigation.navigate('SetProfile', { params1: username });
      }

    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('./Static/bg2.jpg')} // Use require for a local background image
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
        />
        <View style={styles.passCont}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="white"
            secureTextEntry={showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setshowPassword(!showPassword)} // Toggle the showPassword state
            style={styles.eyeIconContainer}
          >
            {showPassword ? (
              <Ionicons name="eye-off" size={24} color="grey" />
            ) : (
              <Ionicons name="eye" size={24} color="grey" />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="blue" /> // Show loading indicator while signing up
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={toLogin}>
          <Text style={styles.t1}>Already have an account? Login Here...</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent black background
    alignItems: "center",
    justifyContent: "center",
  },
  atText: {
    color: 'purple',
    fontSize: 24,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover', // Cover the entire screen with the background image
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
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
  signupButton: {
    backgroundColor: "#0095f6", // Button background color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  signupButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  t1: {
    color: 'white',
    fontSize: 15,
    marginTop: 20,
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
  passCont: {
    display: "flex",
    flexDirection: "row",
  },
  eyeIconContainer: {
    position: "absolute",
    right: 20,
    top: 12,
  },
});

export default Signup;
