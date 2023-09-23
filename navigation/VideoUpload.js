import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

function VideoUpload({ route }) {
  const [caption, setCaption] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [selectedVidHeight, setSelectedVidHeight] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const navigation = useNavigation();
  const { params2 } = route.params;
  const { refreshCallback } = route.params;

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
      }
    })();
  }, []);

  const selectVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission to access media library is required to pick videos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      if (!result.cancelled) {
        const selectedVideoUri = result.uri;
        setSelectedVideo(selectedVideoUri);
        const selectedVideoSize = result.height;
        setSelectedVidHeight(selectedVideoSize);
      }
    } catch (err) {
      console.log('Error picking video:', err);
    }
  };

  const uploadVideo = async () => {
    if (!selectedVideo) {
      console.log('Video data is missing or invalid.');
      return;
    }

    const currentTimestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(7);
    const uniqueName = `${currentTimestamp}-${randomString}.mp4`;

    try {
      const formData = new FormData();
      formData.append('video', {
        uri: selectedVideo,
        type: 'video/*',
        name: uniqueName,
      });
      formData.append('username', params2);
      formData.append('caption', caption);
      formData.append('height', selectedVidHeight);

      const response = await fetch(`http://192.168.43.228:5000/addVideo/${params2}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseData = await response.json();
      navigation.navigate('Home', { params1: params2, params2: params2, imgh: selectedVidHeight });
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Video</Text>
      <TouchableOpacity style={styles.selectVideo} onPress={selectVideo}>
        {selectedVideo ? (
          <video source={{ uri: selectedVideo }} style={styles.selectedVideo} />
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
      <TouchableOpacity style={styles.uploadButton} onPress={uploadVideo}>
        <Text style={styles.buttonText}>Upload Video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectVideo: {
    width: 200,
    height: 200,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  selectedVideo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  captionInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VideoUpload;
