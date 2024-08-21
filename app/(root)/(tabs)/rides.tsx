import React from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleTextInput from "../../../components/GoogleTextInput";
import { icons } from "../../../constants";
import Map from "../../../components/Map";
import { useFetch } from "../../../lib/fetch";
import { Ride } from "../../../types/types";
import { useUser } from "@clerk/clerk-expo";
import RideCar from "../../../components/RideCar";

const Rides = () => {
  const { user } = useUser();
  const { data: recentRides, loading, error } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);
  const handleSignOut = () => {};
  const handleDestinationPress = () => {};
  return (
    <SafeAreaView>
      <FlatList
        data={recentRides}
        renderItem={({ item }) => <RideCar ride={item} />}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  //@ts-ignore
                  source={recentRides!}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides</Text>
              </>
            ) : (
              <View className="flex items-center justify-center">
                <ActivityIndicator
                  color="#000"
                  size="small"
                />
              </View>
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <Text className="text-2xl font-JakartaExtraBold my-5">All Ride</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Rides;
