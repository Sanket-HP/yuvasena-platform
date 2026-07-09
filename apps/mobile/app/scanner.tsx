import React from "react";
import { View, Text } from "react-native";

export default function ScannerScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20 }}>
        QR Scanner Coming Soon
      </Text>
    </View>
  );
}
