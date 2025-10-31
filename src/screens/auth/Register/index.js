import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import Input from "@/utils/ui/input";
import { isEmail, isPassword, getFirebaseErrorMessage, isUsername } from "src/utils/functions";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/hooks";
import { auth, firestore } from "@/api/firebase";
import { showToast } from "@/utils/ui/Toast.js";

export default function Register() {
    const { Colors, Fonts, Gutters, Layout, Images } = useTheme();
    const navigation = useNavigation();

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));

        let errorMsg = "";
        if (field === "username") errorMsg = isUsername(value);
        if (field === "email") errorMsg = isEmail(value);

        setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    };

    const isValidStep1 =
        form.username &&
        form.email &&
        !isUsername(form.username) &&
        !isEmail(form.email);

    const handleRegister = async () => {
        const passwordError = isPassword(form.password);
        if (passwordError) return showToast(passwordError);
        if (form.password !== form.confirmPassword) return showToast("Passwords do not match");

        try {
            const userCredential = await auth().createUserWithEmailAndPassword(form.email, form.password);
            const userId = userCredential.user.uid;

            await firestore().collection("users").doc(userId).set({
                username: form.username,
                email: form.email,
                createdAt: new Date().toISOString(),
            });

            await userCredential.user.sendEmailVerification();
            showToast("Verification link sent! Please check your email.");
            navigation.navigate("Login");
        } catch (error) {
            showToast(getFirebaseErrorMessage(error.code));
        }
    };

    return (
        <ImageBackground source={Images.screens.loginbg} style={[Layout.fill]} resizeMode="stretch">
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={[Gutters.defHPadding, { flexGrow: 1 }]} keyboardShouldPersistTaps="handled">
                    <View style={[Layout.justifyContentCenter, { flex: 1 }]}>
                        <Text style={[Fonts.tiny, Fonts.semibold, Gutters.defBMargin, { color: Colors.text, fontSize: 20 }]}>
                            {step === 1 ? "Let's get you started!" : "Secure your account"}
                        </Text>

                        {step === 1 ? (
                            <>
                                <Input
                                    placeholder="Enter Username"
                                    value={form.username}
                                    onChangeText={(t) => handleChange("username", t)}
                                    showError={!!errors.username}
                                    errorMessage={errors.username}
                                />

                                <Input
                                    placeholder="Enter Email"
                                    value={form.email}
                                    onChangeText={(t) => handleChange("email", t)}
                                    showError={!!errors.email}
                                    errorMessage={errors.email}
                                />

                                <TouchableOpacity style={[Gutters.tinyPadding, Gutters.microBRadius, { backgroundColor: !isValidStep1 ? "#f5c3f5ff" : Colors.primary, width: "100%" }]}
                                    onPress={() => setStep(2)} disabled={!isValidStep1}
                                >
                                    <Text style={[Fonts.fw600, Fonts.center, { color: Colors.white }]}>Next</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Input
                                    placeholder="Enter Password"
                                    secureTextEntry
                                    value={form.password}
                                    onChangeText={(t) => handleChange("password", t)}
                                />
                                <Input
                                    placeholder="Retype Password"
                                    secureTextEntry
                                    value={form.confirmPassword}
                                    onChangeText={(t) => handleChange("confirmPassword", t)}
                                />
                                <TouchableOpacity
                                    style={[Gutters.tinyPadding, Gutters.microBRadius, { backgroundColor: Colors.primary, width: "100%" }]}
                                    onPress={handleRegister}
                                >
                                    <Text style={[Fonts.tiny, Fonts.center, { color: Colors.white }]}>Register</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setStep(1)} style={{ marginTop: 12 }}>
                                    <Text style={[Fonts.center, { color: Colors.primary }]}>Back</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={[Gutters.smallTMargin]}>
                            <Text style={[Fonts.center, Fonts.fw300, { color: Colors.text }]}>
                                Already have an account ? <Text style={[Fonts.semibold, {color: Colors.primary}]}>Login</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}
