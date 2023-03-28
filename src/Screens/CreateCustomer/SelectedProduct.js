import React from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Usage
/* <SelectedProduct item={{ name: "", type: "", price: 0, quantity: 0 }} />; */

const SelectedProduct = (props) => {
  console.log("$$$-props", props);
  const { item } = props;
  return (
    <View style={styles.container}>
      {/* Image View */}
      <View style={styles.imgView}>
        <Image
          style={styles.img}
          source={require("../../Assets/icons/ic_word.png")}
        />
      </View>
      {/* Product */}
      <View style={styles.productView}>
        <View style={styles.productTxtView}>
          <Text style={styles.productNameTxt}>{item.name}</Text>
          <Text style={styles.productTypeTxt}>{`(${item.type})`}</Text>
        </View>
        <Text style={styles.priceTxt}>{`$ ${item.price}`}</Text>
      </View>
      {/* Quantity */}
      <View style={styles.quantityView}>
        <Pressable
          style={styles.quantityIcon}
          onPress={() => alert("- Clicked")}
        >
          <Icon name={"minus"} size={20} color={"#4C5A81"} />
        </Pressable>
        <Text style={styles.quantityTxt}>{item.quantity}</Text>
        <Pressable
          style={styles.quantityIcon}
          onPress={() => alert("+ Clicked")}
        >
          <Icon name={"plus"} size={20} color={"#4C5A81"} />
        </Pressable>
      </View>
    </View>
  );
};

export default SelectedProduct;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "white",
    padding: 10,
    margin: 10,
  },
  imgView: { backgroundColor: "#F0F0F0", borderRadius: 10, padding: 10 },
  img: { height: 40, width: 40 },
  productView: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
  },
  productTxtView: { flexDirection: "row", alignItems: "center" },
  productNameTxt: { color: "#202223", fontWeight: 600, fontSize: 16 },
  productTypeTxt: {
    color: "#686B6C",
    fontWeight: 400,
    fontSize: 12,
    marginLeft: 5,
  },
  priceTxt: { color: "#EFA848", fontWeight: 700, fontSize: 18 },
  quantityView: { flexDirection: "row", alignItems: "center" },
  quantityIcon: { backgrounColor: "#E4EDFF", borderRadius: 10, padding: 5 },
  quantityTxt: { color: "#000000", fontWeight: 600, fontSize: 14 },
});
