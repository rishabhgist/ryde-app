import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useDriverStore, useLocationStore } from "../store";
import { calculateDriverTimes, calculateRegion, generateMarkersFromData } from "../lib/map";
import { Driver, MarkerData } from "../types/types";
import { icons } from "../constants";
import { useFetch } from "../lib/fetch";
import MApViewDirections from "react-native-maps-directions";
import MapViewDirections from "react-native-maps-directions";

const Map = () => {
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const { userLongitude, userLatitude, destinationLatitude, destinationLongitude } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  });

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLongitude || !userLatitude) return;
      const newMarkers = generateMarkersFromData({ data: drivers, userLatitude, userLongitude });
      setMarkers(newMarkers);
    }
  }, [drivers]);

  useEffect(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({ markers: markers, userLatitude, userLongitude, destinationLatitude, destinationLongitude }).then((driver) => setDrivers(driver as MarkerData[]));
    }
  }, [markers, destinationLatitude, destinationLongitude, userLatitude, userLongitude]);

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator
          size="small"
          color="#000"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      showsUserLocation={true}
      userInterfaceStyle="light"
      initialRegion={region}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
          image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker}
        />
      ))}
      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{ latitude: destinationLatitude, longitude: destinationLongitude }}
            title="Destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{ latitude: userLatitude, longitude: userLongitude }}
            destination={{ latitude: destinationLatitude, longitude: destinationLongitude }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
            strokeColor="#0286ff"
            strokeWidth={3}
          />
        </>
      )}
    </MapView>
  );
};

export default Map;
