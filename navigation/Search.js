import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from 'react-native-vector-icons';
import TabBar from "./tabBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";

function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([])
    const route = useRoute();
    const { params1 } = route.params;
    const navigation = useNavigation();

    const handleSearch = () => {
        // Perform the search logic here
        console.log("Searching for:", searchQuery);
        fetch(`http://192.168.43.228:5000/search/${searchQuery}`)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data)
            })
            .catch((error) => {
                console.error(error)
            })
    };

    const checkProfile = (username) => {
    
        navigation.navigate('Profile', { params3: username, params1: params1 })
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={true}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={20} color="white" />
                </TouchableOpacity>
            </View>
            
            <FlatList 
                data={searchResults}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <Image source={{ uri: item.img }} style={styles.userImage} />
                        <TouchableOpacity onPress={() => checkProfile(item.username)}>
                            <View style={styles.userInfo}>
                                <Text style={styles.username}>{item.username}</Text>
                                <Text style={styles.bio}>{item.bio}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )} 
            />
            
            <TabBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        marginHorizontal: 20,
        marginTop: 20,
        elevation: 3,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 8,
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: "#2196F3",
        borderRadius: 4,
        padding: 8,
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingHorizontal: 20,
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 18,
        fontWeight: "bold",
    },
    bio: {
        fontSize: 15,
        color: "#555",
    },
});

export default SearchScreen;
