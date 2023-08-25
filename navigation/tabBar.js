import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from 'react-native-vector-icons';

function TabBar() {
  const navigation = useNavigation();
  const route = useRoute(); // Use the useRoute hook to access route parameters
  const { params1 } = route.params;
  const { usernameOther } = route.params;
  const { isDarkMode } = route.params;
  console.log(isDarkMode)

  console.log(params1)
  console.log(usernameOther)

  const navigateToScreen = (screenName, params) => {
    navigation.navigate(screenName, params);
  };

  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigateToScreen('Home', { params1: params1, params2: params1, params3: params1  })}
      >
        <Ionicons name="home" size={20} color="black" />
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigateToScreen('Search', { params1: params1, params2: params1, params3: params1  })}
      >
        <Ionicons name="search" size={20} color="black"/>
        <Text>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={styles.tabItem}
      onPress={() => navigateToScreen('Notifs', { params1: params1, params2: params1, params3: params1  })}>
        <Ionicons name="notifications" size={20} color="black"/>
        <Text>Inbox</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigateToScreen('Profile', { params1: params1, params2: params1, params3: params1 })}
      >
        <Ionicons name="person" size={20} color="black" />
        <Text>Profile</Text>
      </TouchableOpacity>
      
      {/* Add more tab items as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  darktabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#777',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
});

export default TabBar;
