import { View, Text } from "react-native";
import React from "react";

const CustomTitleText = ({ title }) => {
  return (
    <Text
      style={{
        paddingHorizontal: 10,
        marginTop: 10,
        fontSize: 18,
        fontWeight: 600,
        color: "#000",
      }}
    >
      {title}
    </Text>
  );
};

export default CustomTitleText;
