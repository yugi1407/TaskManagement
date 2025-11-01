import React from 'react';
import { View, Image, Text } from 'react-native';
import { useTheme } from 'src/hooks';

const EmptyState = ({ message, des }) => {
    const { Fonts, Layout, Gutters, Images } = useTheme();

    return (
        <View style={[]}>
            <View style={[Layout.center]}>
                <Image
                    source={Images.screens.empty}
                    style={{ width: 150, height: 150, resizeMode: 'contain' }}
                />
            </View>
            <Text style={[Fonts.ssmall, Fonts.textblue, Fonts.center, Fonts.semibold]}>
                {message}
            </Text>
            {des ? <Text style={[Fonts.shadowlightblue, Fonts.tiny, Gutters.defPadding, Fonts.center, Fonts.fw600]}>{des}</Text> : null}
        </View>
    );
};

export default EmptyState;
