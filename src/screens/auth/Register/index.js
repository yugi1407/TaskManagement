import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import Input from "@/utils/ui/input";
import { isEmail, isPassword, getFirebaseErrorMessage } from "src/utils/functions";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/hooks";
import { auth } from '@/api/firebase';
import { showToast } from "@/utils/ui/Toast.js";

export default function Register() {
    const { Colors, Fonts, Gutters, Layout, Images } = useTheme();
    const navigation = useNavigation();

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "", general: "" });

    const handleChange = (field, value, validator) => {
        setForm({ ...form, [field]: value });
        setErrors((prev) => ({ ...prev, [field]: validator(value) }));
    };

    const handleRegister = async () => {
        const emailError = isEmail(form.email);
        const passwordError = isPassword(form.password);

        if (emailError || passwordError)
            return setErrors({ ...errors, email: emailError, password: passwordError });

        try {
            const userCredential = await auth().createUserWithEmailAndPassword(
                form.email,
                form.password
            );

            await userCredential.user.sendEmailVerification();
            showToast("Verification link sent! Please check your email.");
            navigation.navigate("Login");
        } catch (error) {
            const message = getFirebaseErrorMessage(error.code);
            setErrors({ ...errors, general: message });
            showToast(message);
        }
    };

    const isDisabled =
        !!errors.email || !!errors.password || !form.email || !form.password;

    return (
        <ImageBackground source={Images.screens.loginbg} style={[Layout.fill]} resizeMode='stretch' >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={[Gutters.defHPadding, { flexGrow: 1 }]}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={[Layout.justifyContentCenter, { flex: 1 }]}>
                        <Text style={[Fonts.tiny, Fonts.semibold, { color: Colors.text, fontSize: 20 }]}>
                            Let's get you started!
                        </Text>
                        <Text style={[Fonts.tiny, Fonts.fw600, Gutters.defBMargin, { color: Colors.text }]}>
                            Create your account to continue.
                        </Text>

                        <Input
                            placeholder="Enter Email"
                            value={form.email}
                            onChangeText={(t) => handleChange("email", t, isEmail)}
                            showError={!!errors.email}
                            errorMessage={errors.email}
                        />

                        <Input
                            placeholder="Enter Password"
                            value={form.password}
                            onChangeText={(t) => handleChange("password", t, isPassword)}
                            showError={!!errors.password}
                            errorMessage={errors.password}
                            secureTextEntry
                        />

                        {!!errors.general && (
                            <Text style={{ color: "red", fontSize: 12, marginBottom: 8 }}>
                                {errors.general}
                            </Text>
                        )}

                        <TouchableOpacity style={[Gutters.tinyPadding, Gutters.microBRadius, { backgroundColor: isDisabled ? "#f5c3f5ff" : Colors.primary, width: "100%" }]}
                            onPress={handleRegister} disabled={isDisabled} >
                            <Text style={[Fonts.tiny, Fonts.fw600, Fonts.center, { color: Colors.white }]}>Register</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 16 }} >
                            <Text style={[Fonts.center, Fonts.fw300, { color: Colors.primary}]}>
                                Already have an account? <Text style={Fonts.semibold}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}
