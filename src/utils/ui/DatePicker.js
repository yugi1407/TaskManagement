import React, { useState } from "react";
import { useTheme } from "@/hooks";
import { showToast } from "@/utils/ui/Toast.js";
import { TouchableOpacity, Text, View } from "react-native";
import { formatDateTime } from "src/utils/functions";
import Icon from "react-native-vector-icons/FontAwesome5";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DateTimeInput({
    value,
    onChange,
    label = "Select Date & Time",
    error = "",
    renderButton,
    style = {},
}) {
    const { Colors, Fonts, Gutters, Layout } = useTheme();
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (event, selectedDateValue) => {
        setShowDate(false);
        if (selectedDateValue) {
            const date = new Date(selectedDateValue);
            setSelectedDate(date);
            setShowTime(true);
            onChange(date);
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTime(false);
        if (selectedTime) {
            const now = new Date();
            const newDate = new Date(selectedDate || value || new Date());

            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);

            const isToday =
                newDate.toDateString() === now.toDateString() &&
                newDate.getTime() < now.getTime();

            if (isToday) {
                showToast("You cannot select a past time for today.");
                return;
            }

            onChange(newDate);
        }
    };

    return (
        <View style={[Gutters.ltinyBMargin]}>
            {renderButton ? (
                <TouchableOpacity onPress={() => setShowDate(true)}>
                    {renderButton(value)}
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => setShowDate(true)} style={[Layout.row, Gutters.smallHPadding, Layout.alignItemsCenter, Layout.justifyContentBetween, Gutters.mmicroBMargin, Gutters.microBRadius, Gutters.microVPadding, {
                    backgroundColor: Colors.white, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, height: 50
                }]}>
                    <Text style={[Fonts.ltiny, { color: value ? Colors.text : "#999", fontSize: 13 }]}>
                        {formatDateTime(value, label)}
                    </Text>
                    <Icon name="calendar-alt" size={18} color={Colors.primary} />
                </TouchableOpacity>
            )}

            {error ? (
                <Text style={[Gutters.microLMargin, Fonts.microB, Fonts.fw300, { color: 'red', marginTop: 1 }]}>
                    {error}
                </Text>
            ) : null}

            {showDate && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {showTime && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </View>
    );
}
