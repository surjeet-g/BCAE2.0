import get from "lodash.get";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { commonStyle } from "../Utilities/Style/commonStyle";

/**
* Custom UI for Group Checkbox
* @method
* @param  {string} label caption of Button
* @param  {Object} values active checkbox data
* @param  {Array} data all data checkbox's data
* @param  {bool} isDisabled Toggle state value of button disble or enable
* @param  {function} setValues invoke clicking on submitting checkbox
* @returns {JSX} Return JSX of
*/
export const CheckGroupbox = ({ data, label, setValues, values }) => {
  useEffect(() => {
    setValues(data);

    // setValues(data)
  }, []);

  const { colors } = useTheme();
  return (
    <View style={{ marginTop: 5 }}>
      <Text
        variant="labelSmall"
        style={{
          marginBottom: 6,
          marginLeft: 8,
          color: colors.onSurfaceVariant,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          ...commonStyle.row_start_center,
          la: "flex-start",
          flexWrap: "wrap",
          marginLeft: 7,
        }}
      >
        {data.map((item, index) => (
          <Pressable
            key={index}
            style={{
              ...commonStyle.row_space_arround_center, marginRight: 15,
              borderColor: "gray", borderWidth: .5, borderRadius: 6,
              paddingHorizontal: 6, marginBottom: 5
            }}
            onPress={() => {
              const data = setStatus(values, item);
              console.log("result after ", data);
              setValues(data);
            }}
          >
            <Icon
              name={
                getStatus(values, item) == "checked"
                  ? "checkbox-marked"
                  : "checkbox-blank-outline"
              }
              size={20}
              color={colors.primary}
            />
            <Text
              variant="labelMedium"
              style={{ margin: 5, alignSelf: "baseline", fontSize: 13 }}
            >
              {item.description}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
const getStatus = (values, initialData) => {
  if (get(values, "length", 0) == 0) {
    return initialData.active ? "checked" : "unchecked";
  }
  const result = values.filter((item) => item.code == initialData.code);
  // console.log('value1', result)
  if (get(result, "length", 0) == 0) {
    return initialData.active ? "checked" : "unchecked";
  }
  // console.log('get status ', result[0].active)

  return result[0].active ? "checked" : "unchecked";
};
const setStatus = (selected, item) => {
  let values = selected;
  const data = {
    code: item.code,
    description: item.description,
    active: !item.active,
  };
  if (get(values, "length", 0) == 0) {
    return [data];
  }
  const result = values.findIndex((items) => items.code == item.code);

  if (result == -1) {
    console.log("one", values);
    values = [...values, data];

    // console.log('not found ', values)
    return values;
  } else {
    values[result].active = !values[result].active;

    // console.log(' found ', values)
    return values;
  }

  return [];
};
