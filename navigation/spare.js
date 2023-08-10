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
