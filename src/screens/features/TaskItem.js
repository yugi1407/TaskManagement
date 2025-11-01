import React from "react";
import { View, Text, TouchableOpacity, Pressable, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icons from "react-native-vector-icons/FontAwesome";
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "src/hooks";

export default function TaskItem({ item, onPress }) {
  const { Colors, Layout, Gutters, Fonts, FontSize } = useTheme();
  const navigation = useNavigation();
  const width = Dimensions.get("window").width;

  const Avatar = ({ name }) => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : "?";
    return (
      <View style={[Layout.center, Gutters.largeBRadius, { width: 40, height: 40, backgroundColor: "#E1ECF9" }]}>
        <Text style={[Fonts.bold, Fonts.textblue, { fontSize: FontSize.lsmall }]}>{firstLetter}</Text>
      </View>
    );
  };

  const dueDate = item?.dueDate
    ? new Date(item.dueDate).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : null;

  return (
    <Pressable onPress={onPress}
      style={[Gutters.tinyBRadius, Gutters.defLMargin, Gutters.defRMargin, Gutters.microTMargin, Gutters.ltinyBMargin,
      {
        backgroundColor: Colors.white, shadowColor: "#5858cbff", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.9, shadowRadius: 6, elevation: 8,
      }]}
    >

      <View style={[Layout.row, Gutters.defHPadding, Gutters.defTPadding]}>
        <View style={{ flex: 1.5 }}>
          <Avatar name={item.userName || "U"} />
        </View>

        <View style={{ flex: 6 }}>
          <Text style={[Fonts.textblue, Fonts.tiny, Fonts.fw600]}>{item.userName || "-"}</Text>
          <Text style={[Fonts.textnumber, Fonts.tiny]}>{item.title || "-"}</Text>
        </View>

        <View style={[Layout.alignItemsCenter, Layout.justifyEnd, Layout.row, { flex: 3 }]}>
          <TouchableOpacity style={[Gutters.defBRadius, Gutters.microPadding, { backgroundColor: Colors.primary, marginLeft: 10 }]} onPress={onPress}>
            <MaterialIcons name="edit" size={14} color={"white"} />
          </TouchableOpacity>
        </View>
      </View>

      <LinearGradient
        colors={['#FFFFFF', item.completed ? '#ECF2F9' : '#F9ECEC']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[Gutters.tinyBRRadius, Gutters.tinyBLRadius, Gutters.microMargin, Gutters.smicroLPadding, Gutters.microRPadding]}
      >
        <View style={[Layout.row, Gutters.lmicroPadding, Layout.justifyContentBetween]}>
          <View style={[Layout.rowCenter]}>
            <Text style={[Fonts.tiny, Fonts.fw600, { color: item.completed ? Colors.textgreen : Colors.red }]}> {item.completed ? "Completed" : "Pending"}</Text>
          </View>
          {dueDate && (
            <View style={[Layout.rowCenter]}>
              <Icons name="clock-o" size={14} color={Colors.textgreen} style={{ marginRight: 4 }} />
              <Text style={[Fonts.tiny, Fonts.left, Fonts.fw600, { color: Colors.text }]}>{dueDate}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}
