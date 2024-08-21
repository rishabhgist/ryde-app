import { SignedIn, useAuth, useUser } from "@clerk/clerk-expo";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RideCar from "../../../components/RideCar";
import { Ride } from "../../../types/types";
import { icons, images } from "../../../constants";
import GoogleTextInput from "../../../components/GoogleTextInput";
import Map from "../../../components/Map";
import { useLocationStore } from "../../../store";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Router } from "../../util";
import { useFetch } from "../../../lib/fetch";

export default function Page() {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [hasPermissions, setHasPermissions] = useState(false);

  const { data: recentRides, loading, error } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermissions(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({ latitude: location.coords?.latitude, longitude: location.coords?.longitude });
      setUserLocation({ latitude: location.coords?.latitude, longitude: location.coords?.longitude, address: `${address[0].name}, ${address[0].city}` });
    };
    requestLocation();
  }, []);

  const handleSignOut = async () => {
    signOut();
    Router.replace("/(auth)/sign-in");
  };
  const handleDestinationPress = async ({ latitude, longitude, address }: { latitude: number; longitude: number; address: string }) => {
    setDestinationLocation({ latitude, longitude, address });
    Router.push("/(root)/find-ride");
  };

  return (
    <SafeAreaView className="bg-general-500">
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
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaExtraBold">Welcome, {user?.firstName || "User"}👋</Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image
                  source={icons.out}
                  className="w-4 h-4"
                />
              </TouchableOpacity>
            </View>
            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />
            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">Your Current Location</Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>
            <Text className="text-xl font-JakartaBold mt-5 mb-3">Recent Rides</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
}
