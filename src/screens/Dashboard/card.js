import { Text, View, Image} from 'react-native'
import React from 'react'
import { useTheme } from 'src/hooks';
import LinearGradient from 'react-native-linear-gradient';

export function MarketPlace({ img, title, subtitle, width, textColor }) {
    const { Fonts, Gutters, Images, Colors } = useTheme();
    return (
        <LinearGradient
            colors={['#800080', '#800080']}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[Gutters.smallBMargin, Gutters.defRMargin, Gutters.defBRadius,]}>
            <View style={[Gutters.largeRPadding, Gutters.smallLPadding, Gutters.defBRadius, { height: width * 0.43 }]}>
                <Image
                    source={img}
                    style={[{ width: 70, height: 70 }]}
                />
                <Text style={[Fonts.small, Fonts.semibold, { color: textColor }]}>{title}</Text>
                <Text style={[Fonts.tiny, {color:Colors.white}]}>{subtitle}</Text>
            </View>
        </LinearGradient>
    )
};