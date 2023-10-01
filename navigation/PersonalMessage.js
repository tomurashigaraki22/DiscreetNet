import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { io } from "socket.io-client";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

function PersonalMessage() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { params12 } = route.params;
  const { chattingWith } = route.params;
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // Ref for scrolling to the bottom of the message list
  const flatListRef = useRef(null);

  useEffect(() => {
    const newSocket = io("http://192.168.43.228:5000/");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to the server");
    });

    newSocket.on("send_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Retrieve messages from the server when the screen is mounted
    fetch(`http://192.168.43.228:5000/retrieveMessage/${params12}/${chattingWith}`)
      .then((response) => response.json())
      .then((data) => {
        // Update the messages state with the retrieved messages
        console.log(data)
        setMessages(data);
      });

    return () => {
      // Clean up the socket connection when the component unmounts
      newSocket.disconnect();
    };
  }, [params12, chattingWith]); // Add params12 and chattingWith to the dependency array

  const sendMessage = () => {
    if (message.trim() !== "") {
      // Emit the message to the server
      socket.emit("send_message", { sender: params12, receiver: chattingWith, message });
      setMessage("");

      // Scroll to the bottom of the message list
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }
  };

  const renderMessageItem = ({ item }) => {
    const isSender = item.sender === params12;

    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.senderMessage : styles.receiverMessage,
        ]}
      >
        <Text style={styles.messageText}>
          {item.message}
        </Text>
        <Text style={{
            marginLeft: isSender ? 'auto' : undefined,  // 'auto' or undefined based on the condition
            marginRight: isSender ? undefined : 'auto',  // 'auto' or undefined based on the condition
            color: 'white'
          }}>{item.timestamp}</Text>

      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={{"padding":  null}}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Set to 0 for Android
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" style={styles.backButton} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{chattingWith}</Text>
        </View>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessageItem}
          ref={flatListRef}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            multiline={true}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  timestamp: {
    marginLeft: 'auto',
    color: 'white'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    height: 60,
  },
  backButton: {
    marginRight: 10,
    color: 'black'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  messageContainer: {
    maxWidth: "80%",
    borderRadius: 18,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  senderMessage: {
    alignSelf: "flex-end",
    backgroundColor: "grey",
  },
  receiverMessage: {
    alignSelf: "flex-start",
    backgroundColor: "green",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    height: 80,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "green",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PersonalMessage;
