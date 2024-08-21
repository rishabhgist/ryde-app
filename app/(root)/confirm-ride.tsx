import React from "react";
import { FlatList, Text, View } from "react-native";
import RideLayout from "../../components/RideLayout";
import DriverCar from "../../components/DriverCar";
import Button from "../../components/Button";
import { Router } from "../util";
import { useDriverStore } from "../../store";

const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  return (
    <RideLayout
      snapPoints={["65%", "85%"]}
      title="Choose a driver"
    >
      <FlatList
        data={drivers}
        renderItem={({ item }) => (
          <DriverCar
            item={item}
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(Number(item.id))}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <Button
              title="Select Ride"
              onPress={() => Router.push("/(root)/book-ride")}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};

export default ConfirmRide;
