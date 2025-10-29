import { Text, View, TouchableOpacity, Dimensions, Image } from 'react-native'
import React from 'react'
import LinearGradient  from 'react-native-linear-gradient';
import { useTheme } from "@/hooks";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Banner({ title, sub, conclude, onPress }) {
    const { Layout, Gutters, Colors, Fonts, Images } = useTheme();
    const { width } = Dimensions.get('window');

    return (
        <View style={[{ backgroundColor: Colors.white }]}>
            <TouchableOpacity onPress={onPress}>
                <LinearGradient
                    colors={['#800080', '#FFFFFF']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={[Gutters.smallBRadius, Layout.center, Gutters.smallHPadding, Gutters.defHMargin, Gutters.tinyVPadding, { backgroundColor: "#F3EFEE" }]}
                >
                    <View style={[Layout.rowCenter]}>
                        <View style={{ flex: 5, justifyContent: "center" }}>
                            <Text style={[Fonts.lsmall, Fonts.semibold, { color: Colors.white}]}>
                                {title}
                            </Text>

                            <Text  style={[Fonts.fw600, Fonts.tiny, { color: Colors.white }]}>
                                {sub}
                            </Text>

                            <View style={[Layout.row]}>
                                <Text  style={[Fonts.fw600, Fonts.tiny, Gutters.microBMargin, Gutters.microRMargin, { color: Colors.white }]}>
                                    {conclude}
                                </Text>
                                <Ionicons name="arrow-forward-circle" size={18} color={Colors.primary} />
                            </View>
                        </View>

                        <View style={[Layout.justifyContentCenter, { flex: 3 }]}>
                            <Image
                                source={Images.screens.dashico}
                                style={{ width: width * 0.37, height: 120, resizeMode: "contain" }}
                            />
                        </View>
                    </View>
                </LinearGradient >
            </TouchableOpacity>
        </View>
    )
}
