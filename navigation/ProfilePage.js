import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Image, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

function ProfilePage({ route }) {
  const [profileData, setProfileData] = useState({});
  const [postsData, setPostsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New state to track loading
  const navigation = useNavigation();
  const { params3 } = route.params;

  const editProfile = () => {
    console.log('Editing')
    navigation.navigate('EditProfile')
  }

  useEffect(() => {
    fetch(`http://192.168.43.147:5000/getProfile/${params3}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProfileData(data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
      });
  
    fetch(`http://192.168.43.147:5000/home/${params3}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setPostsData(data);
        console.log(data)
        setIsLoading(false); // Set loading to false when data is fetched
        if (!data) {
          setIsLoading(true)
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Image
          style={styles.profileImage2}
          source={{ uri: profileData.img }}
        />
        <Text style={styles.username}>anonymous_{profileData.username}</Text>
        <TouchableOpacity onPress={editProfile}>
            <Text style={styles.editProfile}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: profileData.img }}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.username}>{profileData.username}</Text>
          <Text style={styles.bio}>{profileData.bio}</Text>
          <View style={styles.statsContainer}>
            {isLoading ? (
                <Text style={styles.stats}>0 Posts</Text>
            ) : (
                <Text style={styles.stats}>{postsData.posts ? postsData.posts.length : '0'} Posts</Text>
            )}
            <Text style={styles.stats}>{profileData.followers} followers</Text>
            <Text style={styles.stats}>{profileData.following} following</Text>
         </View>

        </View>
      </View>
      <Text style={styles.posts}>Posts</Text>
      {isLoading ? ( // Check if loading
        <ActivityIndicator style={styles.loading} size="large" color="#3897f0" />
      ) : (
        <FlatList
          data={postsData.posts}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <Image
                style={styles.postImage}
                source={{ uri: `http://192.168.43.147:5000/${item.img}` }}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  posts: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  stats: {
    marginRight: 16,
    color: "gray",
  },
  editProfile: {
    fontWeight: "bold",
    color: "#3897f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImage2: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoContainer: {
    marginLeft: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 90,
  },
  bio: {
    marginTop: 5,
    color: "gray",
  },
  postContainer: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
  },
  postImage: {
    flex: 1,
    resizeMode: "cover",
  },
});

export default ProfilePage;