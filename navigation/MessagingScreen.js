import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import io from 'socket.io-client';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

// Import the icons you want to use
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
  const [users, setUsers] = useState([]);
  const route = useRoute();
  const navigation = useNavigation()
  const { params1 } = route.params;

  useEffect(() => {
    fetchUsersFollowing(params1);
  }, []);

  const fetchUsersFollowing = (username) => {
    fetch(`https://discreetnetsv.onrender.com/getUsersFollowing/${username}`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUserPress = (user) => {
    // Navigate to the chat screen with the selected user
    navigation.navigate('ChatWithUser', { user });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <View style={styles.userContainer}>
        <Image source={{ uri: item.img }} style={styles.userImage} />
        <Text style={styles.username}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.add}>
        <Text style={styles.headerText}>Messages</Text>
        </View>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search" size={24} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.username}
        renderItem={renderUserItem}
        contentContainerStyle={styles.userList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  add: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10, // Add some padding to the header
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row', // Allow elements inside to be in a row
    marginLeft: 'auto'
  },
  searchIcon: {
    fontSize: 24,
    color: 'black',
  },
  userList: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
