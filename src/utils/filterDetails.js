import React, { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Header from "@/utils/ui/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTheme } from "@/hooks";

const FilterDetail = () => {
    const { Fonts, Colors, Gutters, Layout } = useTheme();
    const route = useRoute();
    const navigation = useNavigation();

    const { type, users = [], titles = [] } = route.params || {};
    const [searchText, setSearchText] = useState("");

    const dataList = type === "username" ? users : titles;

    const filteredList = useMemo(() => {
        if (type === "username") {
            return users.filter((u) =>
                (u.username || "").toLowerCase().includes(searchText.toLowerCase())
            );
        }
        return titles.filter((t) =>
            t.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [searchText, users, titles]);

    const handleSelect = (item) => {
        if (type === "username") {
            navigation.navigate({
                name: "TaskList",
                params: {
                    selectedFilter: {
                        type,
                        value: item.username, 
                        userId: item.id, 
                    },
                },
                merge: true,
            });
        } else {
            navigation.navigate({
                name: "TaskList",
                params: { selectedFilter: { type, value: item } },
                merge: true,
            });
        }
    };
    const handleReset = () => {
        navigation.navigate({
            name: "TaskList",
            params: { selectedFilter: null },
            merge: true,
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgcolor }}>
            <Header headerName={type === "username" ? "Select User" : "Select Title"} />
            <View style={{ flex: 1, padding: 16, paddingBottom: 70 }}>

                <View style={[Layout.row, Layout.alignItemsCenter, Gutters.tinyBMargin, Gutters.tinyTMargin, Gutters.microBRadius, Gutters.microVPadding, Gutters.defHPadding, {
                    backgroundColor: "#FFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
                }]}>
                    <TextInput
                        style={[Fonts.ltiny, { flex: 1, color: Colors.text }]}
                        placeholder={`Search ${type}...`}
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <TouchableOpacity>
                        <Icon name="search" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                {filteredList.length > 0 ? (
                    <FlatList
                        data={filteredList}
                        keyExtractor={(item, index) => `${type}_${index}`}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={[Gutters.defVPadding, { borderBottomWidth: 0.5, borderBottomColor: "#ddd" }]}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={[Fonts.ltiny, Fonts.fw500, Gutters.ltinyLMargin, { color: Colors.text }]}>  {type === "username" ? item.username : item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
                        No results found
                    </Text>
                )}
            </View>

            <View
                style={{
                    position: "absolute",
                    bottom: 20,
                    left: 16,
                    right: 16,
                }}
            >
                <TouchableOpacity
                    onPress={handleReset}
                    style={{
                        backgroundColor: Colors.primary || "#007bff",
                        borderRadius: 10,
                        paddingVertical: 12,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={[Fonts.fw600, { color: "#fff", fontSize: 15 }]}>Reset Filter</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default FilterDetail;
