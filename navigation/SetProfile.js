import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

function SetProfile({ route }) {
    const [bio, setBio] = useState("");
    const { params1 } = route.params
    const navigation = useNavigation();
    const username = params1; // Predefined username

    const profilePictureUrl = "https://th.bing.com/th/id/OIP.cpdLIJVPK5hcO2f9eXXc9AHaE6?pid=ImgDet&rs=1";

    const handleBioChange = (text) => {
        setBio(text);
    };

    const handleSaveProfile = () => {
        if (bio) {
            fetch(`http://192.168.42.144:5000/addProfile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: params1,
                    bio: bio
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Profile saved:", data);
                navigation.navigate('Home', { params2: params1 })
                // You can navigate to another screen or perform additional actions here
            })
            .catch(error => {
                console.error("Error saving profile:", error);
            });
        }
    };
    

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <View style={styles.profileContainer}>
                <Image source={{ uri: profilePictureUrl }} style={styles.circularImage} />
                <Text style={styles.username}>anonymous_{username}</Text>
                <TextInput
                    style={styles.bioInput}
                    placeholder="Enter your bio"
                    value={bio}
                    onChangeText={handleBioChange}
                />
                <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton}>
                    <Text>Save Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    saveButton: {
        backgroundColor: "#0095f6",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    circularImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#fff',
    },
    profileContainer: {
        alignItems: "center",
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
    },
    username: {
        fontSize: 35,
        fontWeight: "bold",
        marginBottom: 40,
    },
    bioInput: {
        width: 300,
        height: 180,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        marginBottom: 10,
    },
});

export default SetProfile;
