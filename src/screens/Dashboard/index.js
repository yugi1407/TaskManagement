import React from "react";
import { View, Text, ScrollView, Image, Dimensions, ToastAndroid, BackHandler, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { useTaskNotificationChecker } from './notify';
import { useSelector } from 'react-redux';
import { useTheme } from "@/hooks";
import { getUsername } from '@/api/tasksApi';
import { capitalizeName } from '@/utils/functions.js'
import { MarketPlace } from "./card";
import Banner from "@/utils/ui/Banner";
import Footer from "@/screens/navigator/userTab";

export default function Index() {
  const { Colors, Fonts, Gutters, Layout, Images, FontSize } = useTheme();
  const { width, height } = Dimensions.get('window');
  const { tasks } = useSelector((state) => state.tasks);
  const navigation = useNavigation();
  const route = useRoute();
  const [username, setUsername] = React.useState('');

  const marketPlace = [
    { img: Images.screens.easyHand, title: '10 points', subtitle: 'for every\n₹200 spent\nonline', textColor: Colors.white },
    { img: Images.screens.bulk, title: '5 points', subtitle: 'Fuel\nsurcharge\nwaiver', textColor: Colors.white },
    { img: Images.screens.bag, title: '2X points', subtitle: 'on travel &\nhotel\nbookings', textColor: Colors.white },
  ];

  useTaskNotificationChecker(tasks);

  useFocusEffect(
    React.useCallback(() => {
      let backPressCount = 0;
      let timeoutRef = null;

      const backAction = () => {
        if (backPressCount === 0) {
          backPressCount += 1;
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
          timeoutRef = setTimeout(() => {
            backPressCount = 0;
          }, 2000);

          return true;
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      const bs = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        bs.remove();
        if (timeoutRef) {
          clearTimeout(timeoutRef);
        }
      };
    }, [])
  );

  React.useEffect(() => {
    const fetchUsername = async () => {
      const username = await getUsername();
      setUsername(username || 'Guest');
    };
    fetchUsername();
  }, []);

  return (
    <View style={[Layout.fill, { backgroundColor: "#fff" }]}>

      <View style={{ backgroundColor: Colors.secondary }}>
        <View style={[Layout.top0, Layout.bottom0, Layout.right0, Layout.left0, Gutters.tinyLPadding, Gutters.tinyRPadding, Gutters.defPadding]}>
          <View style={[Layout.row]}>
            <View style={[Layout.row, { flex: 6, alignItems: 'flex-start' }]}>

              <View style={[Layout.center, Gutters.smallBRadius, Gutters.tinyRMargin, { backgroundColor: Colors.primary, height: 30, width: 30 }]}>
                <Text style={[Fonts.center, Fonts.small, Fonts.fw500, { color: Colors.white }]}>
                  {username.charAt(0).toUpperCase()}
                </Text>
              </View>

              <Text style={[Fonts.center, Fonts.small, Fonts.fw500, { color: Colors.text, top: 3 }]}>{capitalizeName(username)}</Text>
            </View>
            <View style={{ flex: 6, alignItems: 'flex-end' }}>
              <Text style={[Fonts.center, Fonts.small, Fonts.fw500, { color: Colors.text, top: 3 }]}>IrishTask</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}>

        <View style={[Layout.fill, Gutters.defTMargin, Gutters.defBMargin]}>
          <Banner
            title={"Stay on track"}
            sub={"make every task count"}
            conclude={"Tap to read more."}
            onPress={() => navigation.navigate("MyOrders")}
          />
        </View>

        <View style={[Layout.justifyContentCenter, Gutters.defTPadding]}>
          <View style={[Layout.rowCenter, Gutters.mmicroBMargin, { paddingHorizontal: 80 }]}>
            <Image
              source={Images.screens.startstar}
              style={{ width: 40, height: 15, resizeMode: 'contain' }}
            />
            <Text style={[Fonts.fw600, Gutters.tinyHMargin, { color: Colors.text, letterSpacing: 1, fontSize: 15 }]}>
              OUR PRODUCTS
            </Text>

            <Image
              source={Images.screens.endstar}
              style={{ width: 40, height: 15, resizeMode: 'contain' }}
            />
          </View>
        </View>

        <View style={[Layout.row, Gutters.smallVPadding]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[Gutters.smallLPadding]}
          >
            {marketPlace.map((item) => (
              <MarketPlace {...item} width={width} />
            ))}
          </ScrollView>
        </View>

        <Text allowFontScaling={false} style={[Fonts.center, Fonts.primary, Fonts.regular, Fonts.fw300, Gutters.defTMargin, { letterSpacing: 0.5 }]}>
          Plan smart, work hard, <Text style={[Fonts.semibold, { fontSize: FontSize.regular }]}>ACHIEVE</Text>{'\n'}  more!
        </Text>

        <View style={[Layout.alignItemsCenter]}>
          <Image
            source={Images.screens.bigpizza}
            style={{ width: width * 1.9, height: height * 0.55, resizeMode: "contain" }}
          />
        </View>
      </ScrollView>

      <View style={[Layout.justifyEnd]}>
        <Footer
          addButtonText="Add Lead"
          navigation={navigation}
          activeRoute={route.name}
          menuItems={[
            { label: "List", icon: "book-outline", screen: "TaskList" },
            { label: "Form", icon: "settings-outline", screen: "TaskForm" },
            { label: "Setting", icon: "settings-outline", screen: "Settings" },
          ]}
        />
      </View>
    </View>
  );
}
