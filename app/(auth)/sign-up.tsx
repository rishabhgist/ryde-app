import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { icons, images } from "../../constants";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { Link } from "expo-router";
import OAuth from "../../components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import ReactNativeModal from "react-native-modal";
import { Router } from "../util";
import { fetchAPI } from "../../lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [verification, setVerification] = useState({ state: "default", error: "", code: "" });
  const [showSucessModal, setShowSucessModal] = useState(false);

  const router = useRouter();

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification((v) => ({ ...v, state: "pending" }));
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        await fetchAPI("/(api)/user", { method: "POST", body: JSON.stringify({ name: form.name, email: form.email, clerkId: completeSignUp.createdUserId }) });
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification((v) => ({ ...v, state: "success" }));
      } else {
        setVerification((v) => ({ ...v, state: "failed", error: "Verification failed" }));
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      alert(err);
      setVerification((v) => ({ ...v, state: "failed", error: err.errors[0].longMessage }));
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image
            source={images.signUpCar}
            className="z-0 w-full h-[250px]"
          />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">Create Your Account</Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm((v) => ({ ...v, name: value }))}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm((v) => ({ ...v, email: value }))}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            secureTextEntry
            onChangeText={(value) => setForm((v) => ({ ...v, password: value }))}
          />
          <Button
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />
          <OAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal isVisible={showSucessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">Verified</Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">You have successfully verified your account.</Text>
            <Button
              title="Browse Home"
              onPress={() => {
                setShowSucessModal(false);
                Router.push("/(root)/(tabs)/home");
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") setShowSucessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">Verification</Text>
            <Text className="font-Jakarta mb-5">We've sent a verification code to {form.email}</Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(value) => setVerification((v) => ({ ...v, code: value }))}
            />
            {verification.error && <Text className="text-red-500 text-sm mt-1">{verification.error}</Text>}
            <Button
              title="Verify"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;
