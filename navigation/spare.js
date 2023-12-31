import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';
import { Alert } from "react-native";


function HomeScreen() {
    const [selectedImage, setSelectedImage] = useState('');
    const navigation = useNavigation();

    const selectImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
            if (status !== 'granted') {
              Alert.alert('Permission to access media library is required to pick documents.');
              return;
            }
      
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });
      
            if (!result.canceled) {
              // Access the selected image's uri from the assets array
              const selectedImageUri = result.assets[0].uri;
              setSelectedImage(selectedImageUri);
              console.log(selectedImageUri)
            }
          } catch (err) {
            console.log('Error picking document:', err);
          }
    };
    
    

    const uploadImage = async (image) => {
        if (!image || !image.uri) {
            console.log('Image data is missing or invalid.');
            return;
        }
        const currentTimestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(7);
        const uniqueName = `${currentTimestamp}-${randomString}.jpg`
        try{
            const formData = new FormData();
            formData.append('image', {
                uri: image.uri,
                type: 'image/*',
                name: image.fileName || uniqueName,
            });
            console.log('resp')
            console.log(image.uri)

            
            const response = await fetch('http://192.168.43.147:5000/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    },                      
                body: formData,
            });
            console.log('help')

            const responseData = await response.json();
            console.log('Image upload response:', responseData);
        } catch (error) {
            console.error('Image upload error:', error);
        }
    };


    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Text>Welcome to the Home Screen</Text>
            <TouchableOpacity onPress={selectImage}>
                {/* Correctly wrapped comment */}
                <Text>Pick Document</Text>
            </TouchableOpacity>
            {selectedImage && (
                <TouchableOpacity onPress={() => uploadImage({ uri: selectedImage })}>
                    <Text>Upload</Text>
                </TouchableOpacity>
            
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff", // Background color for dark mode effect
        alignItems: "center",
        justifyContent: "center",
    },
});

export default HomeScreen;




<FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={{ uri: `http://192.168.43.147:5000/${item.img}` }} style={styles.profileImage} />
              <Text style={styles.username}>{item.username}</Text>
              <AntDesign name="ellipsis1" size={24} color="black" />
            </View>
            <Image source={{ uri: `http://192.168.43.147:5000/${item.img}` }} style={styles.postImage} />
            <View style={styles.iconBar}>
              <View style={styles.iconBarLeft}>
                <AntDesign name="hearto" size={24} color="black" style={styles.icon} />
                <AntDesign name="message1" size={24} color="black" style={styles.icon} />
                <AntDesign name="paperclip" size={24} color="black" style={styles.icon} />
              </View>
            </View>
            <Text style={styles.likes}>{item.likes} likes</Text>
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
        )}
      />


      const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: "#fff",
          paddingTop: 20,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          marginBottom: 10,
        },
        headerText: {
          fontSize: 24,
          fontWeight: "bold",
        },
        addPostButton: {
          padding: 10,
        },
        postContainer: {
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          backgroundColor: "#fff",
        },
        postHeader: {
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
        },
        profileImage: {
          width: 40,
          height: 40,
          borderRadius: 20,
          marginRight: 10,
        },
        username: {
          flex: 1,
          fontSize: 16,
          fontWeight: "bold",
        },
        postImage: {
          width: "100%",
          height: 300,
          borderRadius: 20,
          resizeMode: "cover",
        },
        iconBar: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
        },
        iconBarLeft: {
          flexDirection: "row",
          alignItems: "center",
        },
        iconBarRight: {
          flexDirection: "row",
          alignItems: "center",
        },
        icon: {
          marginHorizontal: 8,
        },
        likes: {
          fontSize: 16,
          fontWeight: "bold",
          paddingHorizontal: 10,
        },
        caption: {
          fontSize: 16,
          paddingHorizontal: 10,
          marginBottom: 10,
        },
        loadingIndicator: {
          marginTop: 20,
        },
      });



      import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { Alert } from "react-native";
import { ActivityIndicator } from "react-native";

function AddPost({ route }) {
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const navigation = useNavigation();
  const { params2 } = route.params
  console.log(params2)

  const selectImage = async () => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
        if (status !== 'granted') {
          Alert.alert('Permission to access media library is required to pick documents.');
          return;
        }
  
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
  
        if (!result.canceled) {
          // Access the selected image's uri from the assets array
          const selectedImageUri = result.assets[0].uri;
          setSelectedImage(selectedImageUri);
          console.log(selectedImageUri)
        }
      } catch (err) {
        console.log('Error picking document:', err);
      }
};



const uploadImage = async () => {
  if (!selectedImage) {
      console.log('Image data is missing or invalid.');
      return;
  }
  const currentTimestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(7);
  const uniqueName = `${currentTimestamp}-${randomString}.jpg`
  try{
      const formData = new FormData();
      formData.append('image', {
          uri: selectedImage,
          type: 'image/*',
          name: uniqueName,
      });
      console.log('resp')
      console.log(selectedImage)

      
      const response = await fetch('http://192.168.43.147:5000/upload', {
          method: 'POST',
          headers: {
              'Content-Type': 'multipart/form-data',
              },                      
          body: formData,
      });
      console.log('help')

      const responseData = await response.json();
      console.log('Image upload response:', responseData);
  } catch (error) {
      console.error('Image upload error:', error);
  }
};

 

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.header}>Add New Post</Text>
      <TouchableOpacity style={styles.selectImage} onPress={selectImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        ) : (
          <AntDesign name="plus" size={40} color="black" />
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.captionInput}
        placeholder="Write a caption..."
        onChangeText={(text) => setCaption(text)}
        value={caption}
      />
      <TouchableOpacity style={styles.postButton} onPress={() => uploadImage(selectedImage)}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  selectImage: {
    width: 200,
    height: 200,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  captionInput: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  postButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AddPost;




<FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={isDarkMode ? styles.darksContainer : styles.postContainer}>
              <View style={styles.postHeader}>
                <Image source={{ uri: `http://192.168.42.144:5000/${item.img}` }} style={styles.profileImage} />
                <TouchableOpacity onPress={() => handleProfileNavigation(item.username)}>
                  <Text style={isDarkMode ? styles.darkUsername : styles.username}>{item.username}</Text>
                </TouchableOpacity>
                <AntDesign name="ellipsis1" size={24} color="black" style={styles.threebutton}/>
              </View>
              <Image source={{ uri: `http://192.168.42.144:5000/${item.img}` }} style={styles.postImage} />
              <View style={styles.iconBar}>
                <View style={styles.iconBarLeft}>
                  <TouchableOpacity onPress={() => addLike(item.likes, item.caption)}>
                    <AntDesign name="hearto" size={24} color={isDarkMode ? 'white' : 'black'} style={styles.icon} />
                  </TouchableOpacity>
                  <AntDesign name="message1" size={24} color={isDarkMode ? 'white' : 'black'} style={styles.icon} />
                  <AntDesign name="paperclip" size={24} color={isDarkMode ? 'white' : 'black'} style={styles.icon} />
                </View>
              </View>
              <Text style={isDarkMode ? styles.darkLikes : styles.likes}>{item.likes} likes</Text>
              <Text style={isDarkMode ? styles.darkCaption : styles.caption}>{item.caption}</Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["blue"]}
            />












            import React, { useEffect, useState } from 'react';
            import { View, Text, TouchableOpacity } from 'react-native';
            import { TextInput } from 'react-native-gesture-handler';
            import io from 'socket.io-client';
            
            const ChatScreen = () => {
              const [messages, setMessages] = useState([]);
              const [message, setMessage] = useState('');
              const [socket, setSocket] = useState(null);
            
              useEffect(() => {
                // Replace 'http://your-server-url' with the URL of your Socket.IO server
                const newSocket = io('http://192.168.43.227:5000/');
                setSocket(newSocket);
            
                newSocket.on('connect', () => {
                  console.log('Socket.IO connected');
                });
            
                newSocket.on('custom_message', (receivedMessage) => {
                  console.log('Received message:', receivedMessage);
                  setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                });
            
                newSocket.on('error', (error) => {
                  console.error('Socket.IO error:', error);
                });
            
                newSocket.on('disconnect', () => {
                  console.log('Socket.IO disconnected');
                });
            
                return () => {
                  if (newSocket) {
                    newSocket.disconnect();
                  }
                };
              }, []);
            
              const sendMessage = () => {
                if (socket && socket.connected) {
                  socket.emit('custom_message', { message, sender: 'user' }); // Corrected the sender field
                  console.log(message)
                  setMessage('');
                } else {
                  console.error('Socket.IO is not connected');
                }
              };
              
            
              return (
                <View>
                  <Text>Real-time Chatrinf</Text>
                  <View>
                    {messages.map((msg, index) => (
                        <Text key={index}>{msg.sender}: {msg.message}</Text>
                    ))}
                    </View>
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message..."
                  />
                  <TouchableOpacity onPress={sendMessage}>
                    <Text>Send</Text>
                  </TouchableOpacity>
                </View>
              );
            };
            
            export default ChatScreen;
            



            renderItem={({ item }) => {
              console.log(item); // Console log within curly braces
              console.log(item.height);
              const num = parseInt(item.height, 10); // The second argument specifies the base (usually 10 for decimal)
              let nums; // Declare nums variable
          
              if (num >= 500) {
                nums = num - 200; // Assign value here
                console.log(nums);
              } else {
                nums = num; // Assign value here
              }
            
            // Return the JSX for rendering the item
            return (
              <View style={isDarkMode ? styles.darksContainer : styles.postContainer}>
                <View style={styles.postHeader}>
                  <Image source={{ uri: `https://blog.radware.com/wp-content/uploads/2020/06/anonymous.jpg` }} style={styles.profileImage} />
                  <TouchableOpacity onPress={() => handleProfileNavigation(item.username)}>
                    <Text style={isDarkMode ? styles.darkUsername : styles.username}>{item.username}</Text>
                  </TouchableOpacity>
                  <AntDesign name="ellipsis1" size={24} color="black" style={styles.threebutton}/>
                </View>
                <Image
                  source={{ uri: `http://192.168.43.227:5000/${item.img}` }}
                  style={{
                    width: "100%",
                    height: nums, // Use item.height directly
                    borderRadius: 20,
                    resizeMode: "cover",
                  }}
                />
                <View style={styles.iconBar}>
                  <View style={styles.iconBarLeft}>
                    <TouchableOpacity onPress={() => addLike(item.likes, item.caption)}>
                      <AntDesign name="hearto" size={24} color={isDarkMode ? 'white' : 'black'} style={styles.icon} />
                    </TouchableOpacity>
                    <AntDesign name="message1" size={24} color={isDarkMode ? 'white' : 'black'} style={styles.icon} />
                    <AntDesign name="paperclip" size={24} color={isDarkMode ? 'white' : 'black'} style={styles.icon} />
                  </View>
                </View>
                <Text style={isDarkMode ? styles.darkLikes : styles.likes}>{item.likes} likes</Text>
                <Text style={isDarkMode ? styles.darkCaption : styles.caption}>{item.caption}</Text>
              </View>
            );
          }}