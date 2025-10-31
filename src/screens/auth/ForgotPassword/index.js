import React, { useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Input from "@/utils/ui/input";
import { useTheme } from "@/hooks";
import { useNavigation } from "@react-navigation/native";
import { auth } from '@/api/firebase';
import { showToast } from "@/utils/ui/Toast.js";
import { getForgotPasswordError, isEmail } from "src/utils/functions";

export default function ForgotPassword() {
    const { Colors, Fonts, Gutters, Layout, Images } = useTheme();
    const navigation = useNavigation();
    const { width, height } = Dimensions.get("window");

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleReset = async () => {
        if (!email.trim()) {
            setError("Enter your email address.");
            return;
        }
        try {
            await auth().sendPasswordResetEmail(email.trim());
            showToast("Reset link sent. Check your email.");
            navigation.navigate("Login");
        } catch (err) {
            console.log("Reset Error:", err);
            const message = getForgotPasswordError(err.code);
            setError(message);
        }
    };

    const disabled = !email.trim() || !!isEmail(email.trim());

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
                        <Text style={[Fonts.semibold, { color: Colors.text, fontSize: 20 }]}>Forgot your password?</Text>
                        <Text style={[Fonts.fw600, Gutters.defBMargin, { color: Colors.text }]}>Enter your email to reset it.</Text>

                        <Input
                            placeholder="Enter Email"
                            value={email}
                            onChangeText={(val) => {
                                setEmail(val);
                                setError(isEmail(val.trim()));
                            }}
                            showError={!!error}
                            errorMessage={error}
                        />

                        <TouchableOpacity disabled={disabled} style={[Gutters.tinyPadding, Gutters.microBRadius, { backgroundColor: disabled ? "#f5c3f5ff" : Colors.primary, width: "100%" }]} onPress={handleReset}>
                            <Text style={[Fonts.fw600, Fonts.center, { color: Colors.white, fontSize: 15 }]}>
                                Send Reset Link
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 16 }}>
                            <Text style={[Fonts.center, Fonts.fw300, { color: Colors.primary }]}>
                                Back to <Text style={Fonts.semibold}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}
