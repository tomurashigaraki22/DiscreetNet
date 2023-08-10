import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { Alert } from "react-native";

function AddPost({ route }) {
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState('');
  const navigation = useNavigation();
  const { params2 } = route.params

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

  const handlePost = async () => {
    if (!selectedImage) {
      console.log('No image selected.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      type: 'image/jpeg', // Adjust the type as needed
      name: 'image.jpg',
    });
    formData.append('caption', caption);
  
    try {
      const response = await fetch(`http://192.168.43.147:5000/addPost/${params2}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        navigation.goBack();
      } else {
        console.log('Error adding post:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };
 =  

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
      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
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
