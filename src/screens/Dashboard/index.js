import React from "react";
import { View, Text, ScrollView, Image, Dimensions, ToastAndroid, BackHandler, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { useTaskNotificationChecker } from './notify';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from "@/hooks";
import { getUsername } from '@/api/tasksApi';
import Ionicons from "react-native-vector-icons/Ionicons";
import { capitalizeName } from '@/utils/functions.js'
import Banner from "@/utils/ui/Banner";
import Footer from "@/screens/navigator/userTab";

export default function Index() {
  const { Colors, Fonts, Gutters, Layout, Images, FontSize } = useTheme();
  const { width, height } = Dimensions.get('window');
  const { tasks } = useSelector((state) => state.tasks);
  const navigation = useNavigation();
  const route = useRoute();
  const [username, setUsername] = React.useState('');

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

        <LinearGradient
          colors={[Colors.secondary, Colors.white]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[]}>
          <View style={[Layout.alignItemsCenter]}>
            <Image
              source={Images.screens.dashboard}
              style={{ width: width * 1, height: height * 0.45, resizeMode: "contain" }}
            />
          </View>

        </LinearGradient>


        <Text style={[Fonts.lregular, Gutters.regularTMargin, Fonts.center, Fonts.semibold, Gutters.lmicroBMargin, { color: Colors.text }]}>Welcome to Irish Task</Text>
        <Text style={[Fonts.tiny, Fonts.center, Fonts.semibold, Gutters.lmicroBMargin, { color: Colors.grey }]}>Stay on top of your tasks every single day.{'\n'}With Irish Task.</Text>

        <View style={[Layout.fill, Gutters.regularTMargin, Gutters.defBMargin]}>
          <Banner
            title={"Stay on track"}
            sub={"make every task count"}
            conclude={"Tap to read more."}
            onPress={() => navigation.navigate("TaskForm")}
          />
        </View>

        <View style={[Gutters.regularBPadding, Gutters.defHPadding, Gutters.defTPadding, { backgroundColor: "#F8FCFF" }]}>
          <Text style={[Fonts.semibold, Fonts.textblue, { lineHeight: 40, color: "#1F207233", fontSize: 30 }]}>
             smart,{"\n"}task management
          </Text>

          <Text style={[Fonts.tiny, Fonts.semibold, { lineHeight: 35, color: "#1F207233" }]}>
            Made with <Ionicons name="heart" size={12} color="#E10E5A" /> by
            the IrishTask
          </Text>
        </View>
      </ScrollView>

      <View style={[Layout.justifyEnd]}>
        <Footer
          addButtonText="Add Lead"
          navigation={navigation}
          activeRoute={route.name}
          menuItems={[
            { label: "List", icon: "book-outline", screen: "TaskList" },
            { label: "Form", icon: "create-outline", screen: "TaskForm" },
            { label: "Setting", icon: "settings-outline", screen: "Settings" },
          ]}
        />
      </View>
    </View>
  );
}
