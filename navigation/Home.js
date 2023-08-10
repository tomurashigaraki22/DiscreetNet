import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

function HomeScreen({ route, navigation }) {
  const [posts, setPosts] = useState([]);
  const { params1 } = route.params;

  useEffect(() => {
    fetch(`http://192.168.43.147:5000/home/${params1}`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
        <TouchableOpacity
          style={styles.addPostButton}
          onPress={() => navigation.navigate("AddPost", { params2: params1 })}
        >
          <AntDesign name="plus" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Image source={{ uri: item.img }} style={styles.profileImage} />
              <Text style={styles.username}>{item.username}</Text>
              <AntDesign name="ellipsis1" size={24} color="black" />
            </View>
            <Image source={{ uri: item.img }} style={styles.postImage} />
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
    </View>
  );
}

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
});

export default HomeScreen;
