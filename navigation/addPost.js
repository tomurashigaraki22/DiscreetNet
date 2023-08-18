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
  const { refreshCallback } = route.params;
  

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
      formData.append('username', params2)
      formData.append('caption', caption)
      console.log('resp')
      console.log(selectedImage)

      
      const response = await fetch(`https://discreetnetsv.onrender.com/addPost/${params2}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'multipart/form-data',
              },                      
          body: formData,
      });
      console.log('help')

      const responseData = await response.json();
      console.log('Image upload response:', responseData);
      navigation.navigate('Home', {params1 : params2, params2 : params2})
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
