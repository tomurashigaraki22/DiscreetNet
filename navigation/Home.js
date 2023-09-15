import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, Text, FlatList, Image, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "react-native-vector-icons";
import io from "socket.io-client";
import TabBar from "./tabBar";

function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [noneFollowing, setNoneFollowing] = useState(false);
  const [usernameOther, setUsernameOther] = useState("");
  const [notifs, setNotifs] = useState([]);
  const [lastPostId, setLastPostId] = useState('')
  const [isEndReachedLoading, setIsEndReachedLoading] = useState(false);
  const { params1 } = route.params;
  const { params2 } = route.params;
  const [page, setPage] = useState(initialPage); // Add this line to initialize the page state
  const navigation = useNavigation();
  const sockets = io(`http://192.168.42.178:5000`);
  const perPage = 3;
  const initialPage = 1;

  useEffect(() => {
    sockets.connect();

    sockets.on('notification', data => {
      const newNotification = { username: data.username, message: data.message };
      setNotifs(prevNotifications => [...prevNotifications, newNotification]);
      console.log(notifs);
    });

    // Clean up on unmount
    return () => {
      sockets.disconnect();
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const fetchPosts = () => {
    
    fetch(`http://192.168.43.227:5000/getPosts/${params1}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(true)
        console.log("Data received:", data); // Add this line to log the data
        if (data.length > 0) {
          setPosts(data);
          setLastPostId(data[data.length - 1].id)
          console.log('LastPostId: ', data[data.length - 1].id)
          console.log('These are your posts: ', posts)
          setIsLoading(false)
        } else {
          setIsLoading(false)
          setNoneFollowing(true)
        }
        
      })
      .catch((error) => {
        console.error(error);
        setIsRefreshing(false);
        setIsFetching(false);
      });
  };

  const fetchMorePosts = () => {
    fetch(`http://192.168.43.227:5000/getMorePosts/${params1}/${lastPostId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          // Filter out posts with IDs that already exist in the state
          const newPosts = data.filter((newPost) => {
            console.log('NewPost ID: ', newPost)
            return !posts.some((existingPost) => existingPost.id === newPost.id);
          });
  
          if (newPosts.length > 0) {
            setHasMore(true);
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            console.log('New Posts have been added');
          } else {
            setHasMore(false);
            console.log('No new posts to add');
          }
        } else {
          setHasMore(false);
          console.log('No new postsess to add');
        }
      })
      .catch((error) => {
        console.error(error);
        // Handle errors if necessary
      });
  };
  
  
  

  useEffect(() => {
    if (params1) {
      fetchPosts();
    }

    if (params2) {
      fetchPosts();
    }
  }, [params1, params2]);


  const handleLikeUpdate = (data) => {
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === data.id) {
          return { ...post, likes: data.likes };
        }
        return post;
      });
    });
  };

  useEffect(() => {
    // Establish a WebSocket connection
    const socket = io(`http://192.168.43.227:5000/addLike/${params1}`);
    console.log('Running');

    // Listen for real-time updates
    socket.on("like_update", handleLikeUpdate);

    // Return a cleanup function to disconnect the socket when component unmounts
    return () => {
      console.log('Ok na');
    };
  }, []); // Empty dependency array ensures the effect runs only on mount and unmount

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPosts();
  };


  const addLike = (like_no, caption) => {
    const formdata = new FormData();

    // Append the correct username and likes data based on your conditions
    if (params1) {
      formdata.append('username', params1);
      formdata.append('likes', like_no);
      formdata.append('id', caption);
    } else if (params2) {
      formdata.append('username', params2);
      formdata.append('likes', like_no);
      formdata.append('id', caption);
    }

    fetch(`http://192.168.43.227:5000/addLike/${params1}`, {
      method: 'POST',
      body: formdata, // Use the FormData as the request body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message); // Assuming the response returns a message
      })
      .catch((error) => console.error(error));
  };

  const handleProfileNavigation = (usernames) => {
    setUsernameOther(usernames); // Set the usernameOther value
    console.log(usernameOther);
    navigation.navigate('Profile', { params3: usernames, params1: params1 });
  };


  return (
    <View style={isDarkMode ? styles.darkContainer : styles.lightContainer}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={isDarkMode ? styles.darkHeaderText : styles.headerText}>DiscreetNet</Text>
        <TouchableOpacity style={styles.darkModeButton} onPress={toggleDarkMode}>
          {isDarkMode ? (
            <Ionicons name="moon-outline" size={24} color="white" />
          ) : (
            <Ionicons name="sunny-outline" size={24} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.addPostButton} onPress={() => navigation.navigate("AddPost", { params2: params1 })}>
          {isDarkMode ? (
            <AntDesign name="plus" size={24} color='white' />
          ) : (
            <AntDesign name="plus" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>
      {noneFollowing ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>Follow your first user to get started</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
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
                  height: nums,
                  borderRadius: 20,
                  resizeMode: "contain", // Use 'contain' to fit the image within the container
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
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        onEndReached={() => fetchMorePosts()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          if (isFetching) {
            return <ActivityIndicator size="medium" style={styles.loadingIndicator} />;
          } else {
            return null;
          }
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={["blue"]} />
        }
        />
      )}
      <TabBar style={styles.tabBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  threebutton: {
    marginLeft: 'auto',
  },
  darkModeButton: {
    marginLeft: 185,
    paddingRight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50, // Create space for TabBar at the bottom
  },
  
  // Style for the empty message
  emptyMessage: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
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
