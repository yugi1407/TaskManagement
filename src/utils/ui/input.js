import React from "react";
import { View, TextInput, Text } from "react-native";
import { useTheme } from "@/hooks";

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  showError = false,
  errorMessage = "",
  width,
  multiline = false,
  height,
}) {
  const { Colors, Fonts, Gutters, Layout } = useTheme();
  return (
    <View style={[Gutters.ltinyBMargin]}>
      <View style={[Layout.row, Layout.alignItemsCenter, Gutters.mmicroBMargin, Gutters.microBRadius, Gutters.microVPadding, {
        backgroundColor: "#FFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
      }]}>
        <TextInput
          style={[{ width: width || '100%', height: height || (multiline ? 100 : 40) }, Gutters.smallLPadding, Fonts.ltiny,
          { color: Colors.text, backgroundColor: Colors.white },
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#999"
          multiline={multiline}
        />
      </View>

      <View style={{ height: showError ? 15 : 15, overflow: 'hidden' }}>
        {showError && (
          <Text style={[Gutters.microLMargin, Fonts.microB, Fonts.fw300, { color: 'red', marginTop: 1 }]}>
            {errorMessage}
          </Text>
        )}
      </View>
    </View>
  );
}

