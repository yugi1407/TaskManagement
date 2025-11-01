import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ImageBackground, ActivityIndicator } from "react-native";
import Input from "@/utils/ui/input";
import { isEmail, isPassword, getLoginErrorMessage } from "src/utils/functions";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/hooks";
import EncryptedStorage from 'react-native-encrypted-storage';
import { auth } from '@/api/firebase';
import { showToast } from "@/utils/ui/Toast.js";

export default function Login() {
  const { Colors, Fonts, Gutters, Layout, Images } = useTheme();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleChangeEmail = (value) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: isEmail(value) }));
  };

  const handleChangePassword = (value) => {
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: isPassword(value) }));
  };

  const handleLogin = async () => {
    const emailError = isEmail(email);
    const passwordError = isPassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      setLoading(true);
      const { user } = await auth().signInWithEmailAndPassword(email, password);

      if (!user.emailVerified) {
        showToast("Please verify your email before logging in.");
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();

      await EncryptedStorage.setItem("user_session", JSON.stringify({ token, email: user.email }));

      showToast("Login successful!");
      navigation.navigate("Dashboard");
    } catch (error) {
      setLoading(false);
      console.log("Firebase Login Error:", error);
      showToast(getLoginErrorMessage(error.code));
    }
  };

  const disabled = !email || !password;

  return (
    <ImageBackground source={Images.screens.loginbg} style={[Layout.fill]} resizeMode="stretch">
      <KeyboardAvoidingView
        style={[Layout.fill]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[Gutters.defHPadding, { flexGrow: 1 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[Layout.justifyContentCenter, { flex: 1 }]}>
            <Text style={[Fonts.semibold, { color: Colors.text, fontSize: 20 }]}>Welcome back,</Text>
            <Text style={[Fonts.fw600, Gutters.defBMargin, { color: Colors.text }]}>Login to continue your journey!</Text>

            <Input
              placeholder="Enter Email"
              value={email}
              onChangeText={handleChangeEmail}
              showError={!!errors.email}
              errorMessage={errors.email}
            />

            <Input
              placeholder="Enter Password"
              value={password}
              onChangeText={handleChangePassword}
              showError={!!errors.password}
              errorMessage={errors.password}
              secureTextEntry
            />

            {loading ? (
              <View style={[Layout.rowCenter]}>
                <ActivityIndicator style={[{ backgroundColor: Colors.secondary, width: 40, height: 40, borderRadius: 100 }]} size="large" color={Colors.white} />
              </View>
            ) : (

              <TouchableOpacity style={[Gutters.tinyPadding, Gutters.microBRadius, { backgroundColor: disabled ? "#f5c3f5ff" : Colors.primary, width: "100%" }]}
                onPress={handleLogin} disabled={disabled}
              >
                <Text style={[Fonts.fw600, Fonts.center, { color: Colors.white }]}>Login</Text>
              </TouchableOpacity>
            )}

            <View style={[Gutters.smallTMargin, Layout.row, Layout.justifyEnd]}>
              <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={[Fonts.tiny, Fonts.fw600, { color: Colors.text }]}>
                  Forgot Password ?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[Gutters.regularTMargin]}>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={[Fonts.center, Fonts.fw500, { color: Colors.text }]}>
                  New user ? <Text style={[Fonts.semibold, { color: Colors.primary }]}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
