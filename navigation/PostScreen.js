import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";

function FullScreenImageScreen() {
  // Get the image URI from the navigation params
  const route = useRoute()
  const { params4 } = route.params;
  console.log('Image Url: ', params4)

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: params4 }}
        style={styles.image}
        resizeMode="contain" // You can adjust resizeMode as needed
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // Background color of the full-screen view
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default FullScreenImageScreen;
