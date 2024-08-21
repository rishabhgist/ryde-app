import React, { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Router } from "../util";
import Swiper from "react-native-swiper";
import { onboarding } from "../../constants";
import Button from "../../components/Button";

const Onboard = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        onPress={() => Router.replace("/(auth)/sign-up")}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-base font-JakartaBold">Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="w-[32px] h-[4px] mx-1 bg-[#e2e8f0] rounded-full" />}
        activeDot={<View className="w-[32px] h-[4px] mx-1 bg-[#0286ff] rounded-full" />}
        onIndexChanged={(e) => setActiveIndex(e)}
      >
        {onboarding.map((item) => (
          <View
            className="flex items-center justify-center p-5"
            key={item.id}
          >
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold mx-10">{item.title}</Text>
            </View>
            <Text className="text-lg font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">{item.description}</Text>
          </View>
        ))}
      </Swiper>
      <Button
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() => (isLastSlide ? Router.replace("/(auth)/sign-up") : swiperRef.current?.scrollBy(1))}
        className="w-11/12 mt-10"
      />
    </SafeAreaView>
  );
};

export default Onboard;
