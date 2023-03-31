import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useState } from "react";

const CustomerType = (props) => {
  const { name = "NA", icon = "", onPress = () => {} } = props;

  return (
    <View style={{ flexDirection: "column", backgroundColor: "transparent" }}>
      <Pressable style={styles.imgView} onPress={onPress}>
        <Image
          style={styles.img}
          source={require("../../Assets/icons/ic_word.png")}
        />
      </Pressable>
      <Text style={styles.nameTxt}>{name}</Text>
    </View>
  );
};

export default CustomerType;

const styles = StyleSheet.create({
  imgView: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  img: {
    height: 60,
    width: 60,
  },
  nameTxt: {
    marginTop: 5,
    color: "#202223",
    fontSize: 18,
    fontWeight: 400,
    textAlign: "center",
  },
});
