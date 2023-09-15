import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './navigation/login';
import Signup from './navigation/signup';
import SetProfile from './navigation/SetProfile';
import AddPost from './navigation/addPost';
import HomeScreen from './navigation/Home';
import ProfilePage from './navigation/ProfilePage';
import EditProfile from './navigation/editProfile';
import SearchScreen from './navigation/Search';
import NotificationScreen from './navigation/Notifs';
import ChatScreen from './navigation/MessagingScreen';
import PostScreen from './navigation/PostScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Home'component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='Signup' component={Signup} options={{ headerShown: false}} />
        <Stack.Screen name='SetProfile' component={SetProfile} options={{ headerShown: false }} />
        <Stack.Screen name='Profile' component={ProfilePage} options={{ headerShown: false}} />
        <Stack.Screen name='AddPost' component={AddPost} options={{ headerShown: false }} />
        <Stack.Screen name='EditProfile' component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name='Search' component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Notifs' component={NotificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name='ChatScreen' component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name='PostScreen' component={PostScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


