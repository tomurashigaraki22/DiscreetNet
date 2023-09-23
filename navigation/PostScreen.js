import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRoute } from "@react-navigation/native";


function FullScreenImageScreen() {
  const route = useRoute()
  const { params4 } = route.params;
  return(
    <View>
      <Text>Hello World</Text>
    </View>
  ); 
}


export default FullScreenImageScreen;