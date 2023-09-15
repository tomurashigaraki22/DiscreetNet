import { useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { Ionicons } from "react-native-vector-icons"; // Import Ionicons
import { useState, useEffect } from "react";
import TabBar from "./tabBar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

function NotificationScreen() {
  const [notifications, setNotifications] = useState([]); // Use useState to manage notifications
  const [noNotifs, setnoNotifs] = useState(false)
  const route = useRoute()
  const { params1, params3 } = route.params;
  const navigation = useNavigation()

  const handletoMessage = async (parameter) => {
    navigation.navigate('ChatScreen', {params1: parameter})
  }

  useEffect(() => {
    // Fetch data when the component mounts
    fetch(`https://discreetnetsv.onrender.com/getNotifs/${params1}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data) {
          setnoNotifs(false)
          setNotifications(data.reverse()); // Update the state with fetched notifications
        } else {
          setnoNotifs(true)
        }

      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  }, [params1]); // Fetch data whenever params1 changes
  return (
    <View style={styles.container}>
      <View style={styles.headerText}>
        <Text style={styles.header}>Notifications</Text>
      <View style={styles.mailContainer}>
        <TouchableOpacity onPress={() => handletoMessage(params1)} style={styles.mail}>
          <Ionicons name='mail' size={20} color='black' />
        </TouchableOpacity>
      </View>
    </View>

      {noNotifs ? (
        <View>
          <Text>No notifications for this user</Text>
        </View>
      ):(
        <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationContainer}>
            <Image
              source={{ uri: `https://blog.radware.com/wp-content/uploads/2020/06/anonymous.jpg`}}
              style={styles.profileImage}
            />
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationText}>
                <Text style={styles.username}>{item.username}</Text> {item.message}
              </Text>
            </View>
            <Ionicons name="heart" size={20} color="red" style={styles.icon} />
          </View>
        )}
        showsVerticalScrollIndicator={false} // Hide the scroll bar
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
    paddingHorizontal: 15,
  },
  headerText: {
    flexDirection: "row",
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: "bold", // You can adjust the fontWeight as needed
    marginTop: 20, // Add top margin for separation
    marginBottom: 10, // Add bottom margin for separation
  },
  mailContainer: {
    marginLeft: 'auto', // Pushes the mail icon container to the right
  },
  mail: {
    marginLeft: 10, // Add some spacing between "Notifications" and the mail icon
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
  },
  username: {
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 10,
  },
});

export default NotificationScreen;
