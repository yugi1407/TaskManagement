import React, { useState, useMemo } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Text, Keyboard, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTheme } from "@/hooks";

const SearchBar = ({
    data = [],
    value,
    onChangeText,
    onSelectItem,
    selectedItem,
    placeholder = "Search...",
    displayKey = "username",
    errorMessage,
}) => {
    const { Colors, Gutters, Layout, Fonts } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const { width } = Dimensions.get('window');

    const filteredData = useMemo(() => {
        if (!value?.trim()) return [];
        return data.filter((item) =>
            item[displayKey]?.toLowerCase().includes(value.toLowerCase())
        );
    }, [value, data]);

    return (
        <View style={[Gutters.ltinyBMargin]}>
            <View style={[Layout.row, Layout.alignItemsCenter, Gutters.mmicroBMargin, Gutters.microBRadius, Gutters.microVPadding, Gutters.defHPadding, {
                backgroundColor: "#FFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
            }]}>
                <TextInput
                    style={[Fonts.ltiny, { flex: 1, color: Colors.text }]}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={(text) => {
                        onChangeText(text);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setTimeout(() => setIsFocused(false), 150);
                    }}
                />
                <TouchableOpacity onPress={Keyboard.dismiss}>
                    <Icon name="search" size={18} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={{ height: errorMessage ? 15 : 15, overflow: 'hidden' }}>
                {errorMessage ? <Text style={[Gutters.microLMargin, Fonts.microB, Fonts.fw300, { color: 'red', marginTop: 1 }]}>{errorMessage}</Text> : null}
            </View>

            {isFocused && value?.trim() && filteredData.length > 0 && !selectedItem && (
                <View style={{ position: "absolute", left: 0, maxHeight: 200, borderRadius: 8, zIndex: 1000 }}>
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.id?.toString()}
                        keyboardShouldPersistTaps="handled"
                        style={[
                            Layout.fullWidth,
                            Gutters.tinypadding,
                            { zIndex: 1000, backgroundColor: Colors.white, width: width - 60, top: 50 },
                        ]}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#E7EBF7" }}
                                onPress={() => {
                                    onSelectItem(item);
                                    setIsFocused(false);
                                    Keyboard.dismiss();
                                }}
                            >
                                <Text style={[Fonts.ltiny, Fonts.fw500, { color: Colors.text }]}>
                                    {item[displayKey]}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

export default SearchBar;
