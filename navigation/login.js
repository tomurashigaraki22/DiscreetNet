import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const navigation = useNavigation();

  const loginUser = async () => {
    setLoading(true);
    console.log('Logging in...');
    console.log(username);
    console.log(password);

    try {
      const response = await fetch(`http://192.168.42.144:5000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const responseData = await response.text(); // Read raw response as text
      console.log(response.status);

      console.log("Login response:", responseData);
      if (response.status === 200) {
        navigation.navigate('Home', { params1: username });
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
    navigation.navigate('Signup');
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.header}>DiscreetNet</Text>
      {showPop && <Text style={styles.notFound}>Invalid Username Or Password</Text>}
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
      <TouchableOpacity style={styles.loginButton} onPress={loginUser} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="blue" /> // Show loading indicator while logging in
        ) : (
          <Text style={styles.loginButtonText}>Log In</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={toSignUp}>
        <Text style={styles.t1}>New User? Signup Here</Text>
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
  notFound: {
    color: 'red',
    fontSize: 15,
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
  loginButton: {
    backgroundColor: "#0095f6", // Button background color
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
    color: 'white',
    fontSize: 15,
    marginTop: 20,
  }
});

export default Login;
