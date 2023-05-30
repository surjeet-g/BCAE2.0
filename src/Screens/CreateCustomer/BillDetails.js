import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Divider } from "react-native-paper";
import DashedDivider from "./../../Components/DashedDivider";

// // Usage
// <BillDetails
// details={{ gTotal: 1250.0, total: 1250.0, gst: 50.0, discount: 100.0 }}
// />
const BillDetails = (props) => {
  const { gTotal, total, gst, discount } = props.details;
  const Item = (
    title,
    price,
    color = "#000",
    backgroundColor = "transparent"
  ) => {
    return (
      <View style={{ ...styles.itemView, backgroundColor }}>
        <Text style={{ color, fontWeight: 600, fontSize: 16 }}>{title}</Text>
        <Text style={{ color, fontWeight: 600, fontSize: 16 }}>{price}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {Item("Grand Total", `$ ${gTotal}`, "#686B6C")}
      <DashedDivider />
      {Item("GST", `$ ${gst}`, "#5677D2")}
      <DashedDivider />
      {Item("Discount", `$ ${discount}`, "#EFA848")}
      {Item("Total", `$ ${total}`, "#000000", "#DADADA")}
    </View>
  );
};

export default BillDetails;

const styles = StyleSheet.create({
  container: { borderRadius: 10, backgroundColor: "white", margin: 10 },
  itemView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
