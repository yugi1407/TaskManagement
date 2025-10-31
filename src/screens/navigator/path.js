import React, { useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EncryptedStorage from "react-native-encrypted-storage";
import auth from "@react-native-firebase/auth";
import Login from "@/screens/auth/Login";
import Register from "@/screens/auth/Register";
import ForgotPassword from "@/screens/auth/ForgotPassword";
import Dashboard from "@/screens/Dashboard";
import TaskList from 'src/screens/features/TaskList';
import TaskDetail from 'src/screens/features/TaskDetail';
import TaskForm from 'src/screens/features/TaskForm';
import Settings from "@/screens/Settings";

const Stack = createStackNavigator();

export default function Path() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const session = await EncryptedStorage.getItem("user_session");

        if (!session) {
          setInitialRoute("Login");
          return;
        }

        const { token, email } = JSON.parse(session);
        const user = auth().currentUser;

        if (user) {
          const freshToken = await user.getIdToken(true);
          if (freshToken !== token) {
            await EncryptedStorage.setItem(
              "user_session",
              JSON.stringify({ token: freshToken, email })
            );
          }

          setInitialRoute("Dashboard");
        } else {
          setInitialRoute("Login");
        }
      } catch (error) {
        console.log("Session Validation Error:", error);
        setInitialRoute("Login");
      }
    };

    validateSession();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF8AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="TaskList" component={TaskList} />
        <Stack.Screen name="TaskDetail" component={TaskDetail} />
        <Stack.Screen name="TaskForm" component={TaskForm} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
