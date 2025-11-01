import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "@/hooks";
import DateTimeInput from "src/utils/ui/DatePicker";

const Filter = ({ users  = [], titles = [], userId = [], onDateSelect, isAdmin }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const { Layout, Gutters, Fonts, Colors } = useTheme();

    const [selectedFilters, setSelectedFilters] = useState({
        username: "",
        title: "",
        date: null,
    });

    useEffect(() => {
        if (route.params?.selectedFilter) {
            const { type, value } = route.params.selectedFilter;
            setSelectedFilters((prev) => ({ ...prev, [type]: value }));
        }
    }, [route.params?.selectedFilter]);

    const handleDateChange = (date) => {
        setSelectedFilters((prev) => ({ ...prev, date }));
        onDateSelect?.(date);
    };

    const renderFilterBox = (label, value, icon, onPress) => {
        const isActive = !!value;
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={[Layout.rowHCenter, Gutters.microBRadius, Gutters.microPadding,
                { borderWidth: 0.5, borderColor: isActive ? '#0BC568' : Colors.darkshadow, backgroundColor: isActive ? "#ECFFEF" : "#FFFFFF", marginRight: 8, height: 35 },
                ]}
            >
                {icon && (
                    <Ionicons name={icon} size={13} color={isActive ? "#0BC568" : "#7474B9"} style={[Gutters.lmicroLMargin]} />
                )}
                <Text numberOfLines={1} ellipsizeMode="tail"
                    style={[Fonts.tiny, Fonts.center, Gutters.mmicroHPadding, { color: isActive ? '#0BC568' : Colors.darkshadow, top: 1 }]}
                >
                    {value || label}
                </Text>

                <Ionicons name="chevron-forward" size={12} style={{ top: 1 }} color={isActive ? '#0BC568' : Colors.darkshadow} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={[Layout.row]}>
            {isAdmin && renderFilterBox(
                "Username",
                selectedFilters.username,
                "person-outline",
                () =>
                    navigation.navigate("FilterDetails", {
                        type: "username",
                        users, 
                    })
            )}

            {renderFilterBox(
                "Title",
                selectedFilters.title,
                "list-outline",
                () => navigation.navigate("FilterDetails", { type: "title", titles })
            )}

            <DateTimeInput
                value={selectedFilters.date}
                onChange={handleDateChange}
                renderButton={(value) => (

                    <View style={[Layout.rowHCenter, Gutters.microBRadius, Gutters.microPadding,
                    { borderWidth: 0.5, borderColor: value ? "#0BC568" : Colors.darkshadow, backgroundColor: value ? "#ECFFEF" : "#FFFFFF", marginRight: 8, height: 35, }]}
                    >
                        <Ionicons name="calendar-outline" size={13} color={value ? "#0BC568" : "#7474B9"} style={[Gutters.lmicroLMargin]} />
                        <Text numberOfLines={1} ellipsizeMode="tail"
                            style={[Fonts.tiny, Fonts.center, Gutters.mmicroHPadding, { color: value ? "#0BC568" : Colors.darkshadow, top: 1 }]}
                        >
                            {value ? value.toLocaleDateString() : "Date"}
                        </Text>

                        <Ionicons name="chevron-forward" size={12} style={{ top: 1 }} color={value ? "#0BC568" : Colors.darkshadow} />
                    </View>
                )}
            />

        </View>
    );
};

export default Filter;
