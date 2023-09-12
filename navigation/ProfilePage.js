import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, Image, FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TabBar from "./tabBar";

function ProfilePage({ route }) {
  const [profileData, setProfileData] = useState({});
  const [postsData, setPostsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New state to track loading
  const [isMe, setisMe] = useState(false)
  const [followerCount, setFollowerCount] = useState('')
  const [isFollowing, setisFollowing] = useState(false)
  const [showProfileLink, setShowProfileLink] = useState(false);
  const [reply, setReply] = useState('')
  const navigation = useNavigation();
  const { params3 } = route.params;
  const { params1 } = route.params;

  const editProfile = () => {
    console.log('Editing')
    navigation.navigate('EditProfile')
  }

  useEffect(() => {
    if (params3 === params1) {
      setisMe(true)
    } else {
      setisMe(false)
    }
  })

  useEffect(() => {
    if (isMe) {
      setShowProfileLink(true);
    }
  }, [isMe]);  

  const unFollow = () => {
    setisFollowing(false)
    const formdata2 = new FormData();
    formdata2.append('to_unfollow', params1); // Corrected params3 usage
  
    fetch(`http://192.168.43.227:5000/unfollow/${params3}`, {
      method: 'POST',
      body: formdata2
    })
      .then((response) => {
        console.log('Response:', response);
        return response.json();
      })
      .catch((error) => {
        console.error('Fetch Error:', error);
        setisFollowing(true)
      });
    console.log('After fetch');
  };
  
  const follow = () => {
    setisFollowing(true)
    const formdata3 = new FormData();
    formdata3.append('to_follow', params3); // Corrected params3 usage
  
    fetch(`http://192.168.43.227:5000/addFollower/${params1}`, {
      method: 'POST',
      body: formdata3
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error)
        setisFollowing(false)
      });
  };
  
  const formdata = new FormData();
  formdata.append('user2check', params3)

  

  useEffect(() => {
    fetch(`http://192.168.43.227:5000/getProfile/${params3}`)
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
      

    fetch(`http://192.168.43.227:5000/checkFollow/${params1}`, {
      method: 'POST',
      body: formdata,
    })
      .then(response => response.json()) // Parse response as JSON
      .then(data => {
        console.log('Params3: ' + params3)
        console.log(data); // Logging the parsed JSON data
        setReply(data); // Assuming setReply is a state setter function
        setFollowerCount(data.no)
          if (data.status === 'following') {
            setisFollowing(true)
          } else if (data.status === 'not_following') {
            console.log(data.status)
            setisFollowing(false)
          } else if (data.status === 'user_not_found') {
            console.log('user not found')
          } else {
            console.log('Unexpected response: ', data)
          }
        }
      )
      .catch(error => console.error(error));
      
  
    fetch(`http://192.168.43.227:5000/home/${params3}`)
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
          <View style={styles.infoCont}>
          <Text style={styles.username}>{profileData.username}</Text>
          {isMe ? (
            <Text>Profile</Text>
          ):(
            <TouchableOpacity onPress={isFollowing ? unFollow : follow}>
            {isFollowing ? <Text style={styles.unfollow}>Unfollow</Text> : <Text style={styles.follow}>Follow</Text>}
          </TouchableOpacity>
          )}
          </View>
          
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
                source={{ uri: `http://192.168.43.227:5000/${item.img}` }}
              />
            </View>
          )}
        />
      )}
      <TabBar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  unfollow: {
    borderWidth: 1,
    fontSize: 15,
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#ccc',
    padding: 5, // Adding some padding for better spacing
    width: 80, // Fixed width
    textAlign: 'center', // Center the text horizontally
    alignSelf: 'flex-end'
  },
  follow: {
    borderWidth: 1,
    fontSize: 15,
    borderRadius: 5,
    borderColor: 'blue',
    backgroundColor: 'blue',
    padding: 5, // Adding some padding for better spacing
    width: 80, // Fixed width
    textAlign: 'center', // Center the text horizontally
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
  infoCont: {
    flexDirection: 'row', // Set flexDirection to row
    justifyContent: 'space-between', // Add this to space items in the row
    alignItems: 'center', // Align items vertically in the row
    paddingRight: 2, // Adjust the spacing based on username length
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
    fontWeight: 'bold',
    marginRight: 18, // You can adjust this value as needed
     // Allow the username to take available space
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