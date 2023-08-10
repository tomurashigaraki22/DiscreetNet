import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      console.log("Signing up...");
      console.log(username)
      console.log(password)
      const response = await fetch(`http://192.168.43.147:5000/register`, {
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
        navigation.navigate('SetProfile', { params1: username})
      }
  
    } catch (error) {
      console.error("Signup error:", error);
    }
  };
  
  

  const toLogin = () => {
    navigation.navigate('Login')
  }

  return (
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
      <TextInput
        placeholder="Password"
        placeholderTextColor="white"
        secureTextEntry={true}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toLogin} >
        <Text style={styles.t1}>Already have an account? Login Here...</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Background color for dark mode effect
    alignItems: "center",
    justifyContent: "center",
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
  }
});

export default Signup;
