import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, Text, FlatList, Image, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "react-native-vector-icons";
import io from "socket.io-client";
import { Dimensions } from "react-native";
import TabBar from "./tabBar";
import { FontAwesome } from "@expo/vector-icons";
import { Video, ResizeMode } from 'expo-av';

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
  const [alreadyLikeds, setalreadyLikeds] = useState(false)
  const [isEndReachedLoading, setIsEndReachedLoading] = useState(false);
  const { params1 } = route.params;
  const { params2 } = route.params;
  const [loadingMore, setLoadingMore] = useState(false)
  const [socket, setSocket] = useState(null)
  const [page, setPage] = useState(initialPage); // Add this line to initialize the page state
  const navigation = useNavigation();
  const perPage = 3;
  const initialPage = 1;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const fetchPosts = () => {
    fetch(`http://192.168.43.228:5000/fetchPosts/${params1}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(true);
        console.log("Data received:", data);
  
        if (data.length > 0) {
          // Initialize the 'alreadyLiked' property for each post
          const postsWithLikes = data.map((post) => {
            post.alreadyLiked = false; // Add this line
            return post;
          });
  
          setPosts(postsWithLikes);
          setLastPostId(data[data.length - 1].id);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setNoneFollowing(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsRefreshing(false);
        setIsFetching(false);
      });
  };
  

  const fetchMorePosts = () => {
    if (loadingMore || !hasMore) {
      return;
    }

    setIsFetching(true);
    setLoadingMore(true)

    fetch(`http://192.168.43.228:5000/getMorePosts/${params1}/${lastPostId}`)
      .then((response) => response.json())
      .then((data) => {
        setLoadingMore(true)
        if (data.length > 0) {
          // Filter out posts with IDs that already exist in the state
          const newPosts = data.filter((newPost) => {
            return !posts.some((existingPost) => existingPost.id === newPost.id);
          });

          if (newPosts.length > 0) {
            setHasMore(true);
            setPosts((prevPosts) => [...prevPosts, ...newPosts]);
            setLoadingMore(false)
          } else {
            setHasMore(false);
            setLoadingMore(false)
          }
        } else {
          setHasMore(false);
          setLoadingMore(false)
        }
        setLoadingMore(false)
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsFetching(false);
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPosts();
  };

  useEffect(() => {
    const Newsocket = io('http://192.168.43.228:5000/');
    setSocket(Newsocket);

    Newsocket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    Newsocket.on('already_liked', (data) => {
      // Find the post in the state and mark it as already liked
      const updatedPosts = posts.map((post) => {
        if (post.id === data.id) {
          post.alreadyLiked = true; // Update the 'alreadyLiked' property
        }
        return post;
      });
    
      // Update the state with the updated posts
      setPosts(updatedPosts);
    });

    

    // Listen for the "liked_post" event from the server
    Newsocket.on('liked_post', (data) => {
      // Find the post in the state and update its like count and set alreadyLiked to true
      const updatedPosts = posts.map((post) => {
        if (post.id === data.id) {
          return { ...post, likes: data.likes, alreadyLiked: true }; // Set alreadyLiked to true
        }
        return post;
      });
    
      // Update the state with the updated posts
      setPosts(updatedPosts);
      setalreadyLikeds(true);
    });
    
    Newsocket.on('unliked_post', (data) => {
      // Find the post in the state and update its like count and set alreadyLiked to false
      const updatedPosts = posts.map((post) => {
        if (post.id === data.id) {
          return { ...post, likes: data.likes, alreadyLiked: false }; // Set alreadyLiked to false
        }
        return post;
      });
    
      // Update the state with the updated posts
      setPosts(updatedPosts);
      setalreadyLikeds(false);
    });
    

    return () => {
      if (Newsocket) {
        Newsocket.disconnect();
      }
    };
  }, [posts]);


  const addLike = (id, like_no, username) => {
    // Use the Newsocket instance here
    socket.emit('liked_post', { id, like_no, username });
  };

  

  const handleProfileNavigation = (usernames) => {
    setUsernameOther(usernames); // Set the usernameOther value
    console.log(usernameOther);
    navigation.navigate('Profile', { params3: usernames, params1: params1 });
  };

  const postFullScreen = (img_uri) => {
    console.log('Going to post full screen')
    navigation.navigate('PostScreen', { params4: img_uri})
  }


  return (
    <View style={isDarkMode ? styles.darkContainer : styles.lightContainer}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={isDarkMode ? styles.darkHeaderText : styles.headerText}>DiscreetNet</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.darkModeButton} onPress={toggleDarkMode}>
            {isDarkMode ? (
              <Ionicons name="moon-outline" size={24} color="white" />
            ) : (
              <Ionicons name="sunny-outline" size={24} color="black" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton} onPress={() => navigation.navigate('VideoUpload', { params1: params1})}>
            {isDarkMode ? (
              <AntDesign name='camera' size={24} color='white' />
            ) : (
              <AntDesign name='camera' size={24} color='black' />
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
            const screenWidth = Dimensions.get('window').width;
            const maxImageHeight = 500; // Set your maximum image height here
            console.log(item.isVideo)

            // Calculate the scaled dimensions based on screen width and aspect ratio
            const imageAspectRatio = item.width / item.height; // Assuming you have the image's width and height
            let scaledWidth = screenWidth; // Set the width to the screen width
            let scaledHeight = screenWidth / imageAspectRatio; // Calculate the height based on the aspect ratio

            // Ensure the height does not exceed the maximum height
            if (scaledHeight > maxImageHeight) {
              scaledHeight = maxImageHeight;
              scaledWidth = maxImageHeight * imageAspectRatio;
            }

            // Check if scaledWidth or scaledHeight became NaN and handle it
            if (isNaN(scaledWidth) || isNaN(scaledHeight)) {
              scaledWidth = screenWidth; // Use a default value if they are NaN
              scaledHeight = screenWidth; // Use a default value if they are NaN
            }


          // Return the JSX for rendering the item
          const heartIconColor = item.alreadyLiked ? 'red' : 'black';
          return (
            <View style={isDarkMode ? styles.darksContainer : styles.postContainer}>
              <View style={styles.postHeader}>
                <Image source={{ uri: `https://blog.radware.com/wp-content/uploads/2020/06/anonymous.jpg` }} style={styles.profileImage} />
                <TouchableOpacity onPress={() => handleProfileNavigation(item.username)}>
                  <Text style={isDarkMode ? styles.darkUsername : styles.username}>{item.username}</Text>
                </TouchableOpacity>
                <AntDesign name="ellipsis1" size={24} color="black" style={styles.threebutton}/>
              </View>
              {item.isVideo ? (
                <View style={styles.videoContainer}>
                    <Video
                      source={{uri: `http://192.168.43.228:5000/${item.img}`}}
                      style={styles.video}
                      muted={false}
                      repeat={true}
                      resizeMode={"contain"}
                      rate={1.0}
                      useNativeControls
                      ignoreSilentSwitch={"obey"}
                    />
              
                </View>
                
                
              ) : (
                <TouchableOpacity onPress={() => postFullScreen(`http://192.168.43.228:5000/${item.img}`)}>
                <Image
                  source={{ uri: `http://192.168.43.228:5000/${item.img}` }}
                  style={{
                    borderRadius: 20,
                    width: "100%",
                    height: scaledHeight,
                    resizeMode: "contain", // Use 'cover' to maintain aspect ratio and fill the container
                  }}
                />
              </TouchableOpacity>
              )}
              
              <View style={styles.iconBar}>
                <View style={styles.iconBarLeft}>
                <TouchableOpacity onPress={() => addLike(item.id, item.likes, params1)}>
                {item.alreadyLiked ? (
                  <FontAwesome
                    name="heart"
                    size={24}
                    color="red" // Filled heart color when already liked
                    style={styles.icon}
                  />
                ) : (
                  <FontAwesome
                    name="heart-o"
                    size={24}
                    color="black" // Outlined heart color when not liked
                    style={styles.icon}
                  />
                )}
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
        ListFooterComponent={() => (
          // Render a loading indicator at the end
          loadingMore ? (
            <ActivityIndicator size="medium" color="blue" />
          ) : null
        )}
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
  videoContainer: {
    width: '100%', // Set the width to the full width of the screen
    height: 300,   // Set the initial height as needed
    marginBottom: 10,
  },
  video: {
    flex: 1,
    height: undefined, // Allow the video to determine its own height
    width: '100%',     // Set the width to the full width of the container
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50, // Create space for TabBar at the bottom
  },
  buttonContainer2: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 'auto'
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
    justifyContent: "space-between", // Distribute items evenly along the header
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  darkHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "white",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row", // Horizontal layout for buttons
    alignItems: "center", // Center items vertically
  },
  addPostButton: {
    marginLeft: 20, // Add some margin between the buttons
  },
  darkModeButton: {
    marginLeft: 20, // Add some margin between the buttons
  },
  cameraButton: {
    marginLeft: 20, // Add some margin between the buttons
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
