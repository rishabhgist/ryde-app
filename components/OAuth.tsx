import { useOAuth } from "@clerk/clerk-expo";

import React from "react";
import { Alert, Text, View } from "react-native";
import Button from "./Button";
import { Image } from "react-native";
import { icons } from "../constants";
import { googleOAuth } from "../lib/auth";
import { Router } from "../app/util";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = async () => {
    const result = await googleOAuth(startOAuthFlow);
    if (result.code === "session_exists" || result.code === "sucess") {
      Router.replace("/(root)/(tabs)/home");
    }
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>
      <Button
        title="Log In with Google"
        className="mt-5 w-full shadow-none"
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
      />
    </View>
  );
};

export default OAuth;
