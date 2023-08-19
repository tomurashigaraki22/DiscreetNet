import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, Text, FlatList, Image, StyleSheet, RefreshControl } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "react-native-vector-icons"; // Import Ionicons
import { ActivityIndicator } from "react-native";
import io from "socket.io-client";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from "./tabBar";

function HomeScreen({ route }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDarkMode, setisDarkMode] = useState(false);
  const [usernameOther, setUsernameOther] = useState("");
  const { params1 } = route.params;
  const { params2 } = route.params;
  const navigation = useNavigation();


  const toggleDarkMode = () => {
    setisDarkMode(!isDarkMode);
  };
  useEffect(() => {
    if (params1) {
      fetch(`http://192.168.43.147:5000/main/${params1}`)
        .then((response) => response.json())
        .then((data) => {
          setPosts(data.posts.reverse());
          setIsLoading(false);
        })
        .catch((error) => console.error(error));
    }
    if (params2) {
      fetch(`http://192.168.43.147:5000/main/${params2}`)
        .then((response) => response.json())
        .then((data) => {
          setPosts(data.posts.reverse());
          setIsLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, [params1, params2]);
  
  

  useEffect(() => {
    // Establish a WebSocket connection
    const socket = io(`http://192.168.43.147:5000/addLike/${params1}`);
    console.log('Running')
    
    // Listen for real-time updates
    const handleLikeUpdate = (data) => {
      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post.id === data.id) {
            console.log('It worked')
            return { ...post, likes: data.likes };
          }
          console.log('It did not work')
          return post;
        });
      });
    };
  
    socket.on("like_update", handleLikeUpdate);
  
    // Return a cleanup function to disconnect the socket when component unmounts
    return () => {
      console.log('Ok na')
    };
  }, []); // Empty dependency array ensures the effect runs only on mount and unmount
  
   

  const handleRefresh = () => {
    setIsRefreshing(true);

    fetch(`http://192.168.43.147:5000/main/${params1}`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts.reverse());
        setIsRefreshing(false);
      })
      .catch((error) => {
        console.error(error);
        setIsRefreshing(false);
      });
  };

  const addLike = (like_no, caption) => {
    const formdata = new FormData();
    console.log(caption)
    
    // Append the correct username and likes data based on your conditions
    if (params1) {
      formdata.append('username', params1);
      formdata.append('likes', like_no);
      formdata.append('id', caption)
    } else if (params2) {
      formdata.append('username', params2);
      formdata.append('likes', like_no);
      formdata.append('id', caption)
    }
    
    fetch(`https://discreetnetsv.onrender.com/addLike/${params1}`, {
      method: 'POST',
      body: formdata, // Use the FormData as the request body
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message); // Assuming the response returns a message
    })
    .catch((error) => console.error(error));
  }


  const handleProfileNavigation = (usernames) => {
    setUsernameOther(usernames); // Set the usernameOther value
    console.log(usernameOther)
    navigation.navigate('Profile', { params3 : usernames })
  };  
  

  return (
    <View style={isDarkMode ? styles.darkContainer : styles.lightContainer}>
      
    <StatusBar hidden />
    <View style={styles.header}>
      
      <Text style={isDarkMode ? styles.darkHeaderText : styles.headerText}>DiscreetNet</Text>
      <TouchableOpacity
        style={styles.darkModeButton}
        onPress={toggleDarkMode}
      >
        {/* Use the appropriate Ionicons component for the dark mode button */}
        {isDarkMode ? (
          <Ionicons name="moon-outline" size={24} color="white" />
        ) : (
          <Ionicons name="sunny-outline" size={24} color="black" />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addPostButton}
        onPress={() => navigation.navigate("AddPost", { params2: params1 })}
      >
        {isDarkMode ? (
          <AntDesign name="plus" size={24} color='white' />
        ): (
          <AntDesign name="plus" size={24} color="black" />
        )}
      </TouchableOpacity>
    </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={isDarkMode ? styles.darksContainer : styles.postContainer}>
              <View style={styles.postHeader}>
                <Image source={{ uri: `http://192.168.43.147:5000/${item.img}` }} style={styles.profileImage} />
                <TouchableOpacity onPress={() => handleProfileNavigation(item.username)}>
                  <Text style={isDarkMode ? styles.darkUsername : styles.username}>{item.username}</Text>
                </TouchableOpacity>
                <AntDesign name="ellipsis1" size={24} color="black" style={styles.threebutton}/>
              </View>
              <Image source={{ uri: `http://192.168.43.147:5000/${item.img}` }} style={styles.postImage} />
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
          }
        />
      )}
      <TabBar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  threebutton: {
    marginLeft: 230,
  },
  darkModeButton: {
    marginLeft: 150,
  },
  darkContainer: {
    backgroundColor: "#333", // Dark mode background color
    flex: 1,
    paddingTop: 20,
  },
  lightContainer: {
    backgroundColor: "#fff", // Light mode background color
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  darkHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: 'italic',
    color: 'white'
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: 'italic'
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
  darksContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    backgroundColor: "#333",
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
  darkUsername: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
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
    paddingTop: 15,
    paddingBottom: 10,
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
  darkLikes: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    color: 'white',
  },
  darkCaption: {
    fontSize: 19,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'white'
  },
  caption: {
    fontSize: 19,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default HomeScreen;
